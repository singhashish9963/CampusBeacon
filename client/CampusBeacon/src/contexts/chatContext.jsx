import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getCurrentUtcTime = () => {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  return utc.toISOString().slice(0, 19).replace("T", " ");
};

const formatTypingUsers = (typingUsers, userProfiles, currentUser) => {
  const users = Array.from(typingUsers)
    .map((userId) => {
      if (userId === currentUser?.id) return null;
      return userProfiles[userId]?.name || "Someone";
    })
    .filter(Boolean);

  if (users.length === 0) return "";
  if (users.length === 1) return `${users[0]} is typing...`;
  if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`;
  return `${users[0]} and ${users.length - 1} others are typing...`;
};

export const ChatContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [userProfiles, setUserProfiles] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [lastTypingTime, setLastTypingTime] = useState(0);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const PAGE_SIZE = 20; // Number of messages to fetch per page

  const fetchChannels = async () => {
    try {
      const { data } = await api.get("/api/chat/channels");
      setChannels(data.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch channels");
    }
  };

  const fetchUserProfile = async (userId) => {
    if (userProfiles[userId]) return userProfiles[userId];

    try {
      const response = await api.get(`/api/users/user/${userId}`);
      if (response.data.success) {
        const userData = response.data.data.user;
        setUserProfiles((prev) => ({
          ...prev,
          [userId]: userData,
        }));
        return userData;
      }
    } catch (error) {
      console.error(`Failed to fetch user profile for ${userId}:`, error);
    }
    return null;
  };

  useEffect(() => {
    if (user?.id && !socket) {
      const newSocket = io(
        import.meta.env.VITE_API_URL || "http://localhost:5000",
        {
          withCredentials: true,
          transports: ["websocket", "polling"],
        }
      );

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        fetchChannels();
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (message) => {
      const userProfile = await fetchUserProfile(message.userId);
      const formattedMessage = {
        ...message,
        username:
          message.userId === user?.id
            ? user.username
            : userProfile?.name || "Unknown User",
        userDetails: userProfile,
        timestamp: getCurrentUtcTime(),
      };
      setMessages((prev) => [...prev, formattedMessage]);
    };

    const handleUserTyping = async ({ userId, channelId }) => {
      if (channelId === currentChannel && userId !== user?.id) {
        await fetchUserProfile(userId);
        setTypingUsers((prev) => new Set([...prev, userId]));
      }
    };

    const handleUserStopTyping = ({ userId, channelId }) => {
      if (channelId === currentChannel) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("message-deleted", ({ messageId, channelId }) => {
      if (channelId === currentChannel) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    });
    socket.on("message-updated", async (updatedMessage) => {
      const userProfile = await fetchUserProfile(updatedMessage.userId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === updatedMessage.id
            ? {
                ...updatedMessage,
                username:
                  updatedMessage.userId === user?.id
                    ? user.username
                    : userProfile?.name || "Unknown User",
                userDetails: userProfile,
                timestamp: getCurrentUtcTime(),
              }
            : msg
        )
      );
    });

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("new-message");
      socket.off("message-deleted");
      socket.off("message-updated");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [socket, currentChannel, user?.id]);

  const handleTyping = (isTyping) => {
    if (!socket || !currentChannel) return;

    const now = Date.now();
    if (isTyping) {
      if (!isUserTyping && now - lastTypingTime > 1000) {
        socket.emit("typing-start", currentChannel);
        setIsUserTyping(true);
      }
      setLastTypingTime(now);

      // Stop typing indicator after 2 seconds of no typing
      setTimeout(() => {
        const timeSinceLastType = Date.now() - lastTypingTime;
        if (timeSinceLastType >= 2000 && isUserTyping) {
          socket.emit("typing-stop", currentChannel);
          setIsUserTyping(false);
        }
      }, 2000);
    } else if (isUserTyping) {
      socket.emit("typing-stop", currentChannel);
      setIsUserTyping(false);
    }
  };

  const sendMessage = async (content) => {
    if (!currentChannel || !content.trim()) return;
    try {
      const tempId = Date.now();
      const timestamp = getCurrentUtcTime();

      // Stop typing indicator when sending message
      if (isUserTyping) {
        socket.emit("typing-stop", currentChannel);
        setIsUserTyping(false);
      }

      const optimisticMessage = {
        id: tempId,
        content,
        userId: user.id,
        channelId: currentChannel,
        username: user.username,
        timestamp,
        userDetails: userProfiles[user.id],
        temp: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      socket.emit("new-message", {
        content,
        channelId: currentChannel,
        timestamp,
      });

      const response = await api.post(
        `/api/chat/channels/${currentChannel}/messages`,
        {
          content,
          timestamp,
        }
      );

      const actualMessage = {
        ...response.data.data,
        username: user.username,
        userDetails: userProfiles[user.id],
        timestamp,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? actualMessage : m))
      );
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to send message");
      setMessages((prev) => prev.filter((m) => !m.temp));
    }
  };

  const deleteMessage = async (messageId) => {
    if (!socket || !currentChannel) return;

    try {
      socket.emit("delete-message", {
        messageId,
        channelId: currentChannel,
        timestamp: getCurrentUtcTime(),
        userId: user.id,
      });

      await api.delete(`/api/chat/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Delete message error:", error);
      setError(error?.response?.data?.message || "Failed to delete message");
    }
  };

  const updateMessage = async (messageId, content) => {
    try {
      const timestamp = getCurrentUtcTime();

      socket.emit("update-message", {
        messageId,
        content,
        channelId: currentChannel,
        timestamp,
      });

      const response = await api.put(`/api/chat/messages/${messageId}`, {
        content,
        timestamp,
      });

      const updatedMessage = {
        ...response.data.data,
        username: user.username,
        userDetails: userProfiles[user.id],
        timestamp,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? updatedMessage : m))
      );
      setEditingMessage(null);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update message");
    }
  };

  const joinChannel = async (channelId) => {
    if (socket && channelId) {
      try {
        console.log("Joining channel:", channelId);
        socket.emit("join-channel", channelId);
        setCurrentChannel(channelId);
        setLoading(true);
        setTypingUsers(new Set()); // Clear typing users when changing channels
        setMessages([]); // Clear existing messages
        setHasMoreMessages(true); // Reset for new channel

        const { data } = await api.get(
          `/api/chat/channels/${channelId}/messages?page=1&limit=${PAGE_SIZE}`
        );

        const messages = Array.isArray(data.data) ? data.data : [];
        setHasMoreMessages(messages.length === PAGE_SIZE);

        const userIds = [...new Set(messages.map((msg) => msg.userId))];
        await Promise.all(userIds.map(fetchUserProfile));

        const formattedMessages = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp || getCurrentUtcTime(),
          username:
            msg.userId === user?.id
              ? user.username
              : userProfiles[msg.userId]?.name || "Unknown User",
          userDetails: userProfiles[msg.userId] || null,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error joining channel:", error);
        setError("Failed to join channel");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchOlderMessages = async (channelId, beforeMessageId) => {
    if (!channelId || !beforeMessageId || !hasMoreMessages) {
      return { hasMore: false };
    }

    try {
      const { data } = await api.get(
        `/api/chat/channels/${channelId}/messages`,
        {
          params: {
            before: beforeMessageId,
            limit: PAGE_SIZE,
          },
        }
      );

      const olderMessages = Array.isArray(data.data) ? data.data : [];
      const hasMore = olderMessages.length === PAGE_SIZE;

      if (olderMessages.length > 0) {
        const userIds = [...new Set(olderMessages.map((msg) => msg.userId))];
        await Promise.all(userIds.map(fetchUserProfile));

        const formattedMessages = olderMessages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp || getCurrentUtcTime(),
          username:
            msg.userId === user?.id
              ? user.username
              : userProfiles[msg.userId]?.name || "Unknown User",
          userDetails: userProfiles[msg.userId] || null,
        }));

        setMessages((prev) => [...formattedMessages, ...prev]);
        setHasMoreMessages(hasMore);
      } else {
        setHasMoreMessages(false);
      }

      return { hasMore };
    } catch (error) {
      console.error("Error fetching older messages:", error);
      return { hasMore: false };
    }
  };

  const formattedTypingIndicator = formatTypingUsers(
    typingUsers,
    userProfiles,
    user
  );

  const value = {
    socket,
    messages,
    channels,
    currentChannel,
    loading,
    error,
    typingUsers,
    typingIndicator: formattedTypingIndicator,
    sendMessage,
    deleteMessage,
    updateMessage,
    joinChannel,
    handleTyping,
    fetchChannels,
    fetchOlderMessages,
    hasMoreMessages,
    user,
    userProfiles,
    editingMessage,
    setEditingMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export default ChatContext;
