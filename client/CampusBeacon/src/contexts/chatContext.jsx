import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios"; // Add this import
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ChatContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    if (user?.id) {
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setError("Failed to connect to chat server");
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-message", (message) => {
      setMessages((prev) => [message, ...prev]);
    });

    socket.on("message-deleted", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    socket.on("user-typing", ({ userId }) => {
      setTypingUsers((prev) => new Set([...prev, userId]));
    });

    socket.on("user-stop-typing", ({ userId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      socket.off("new-message");
      socket.off("message-deleted");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [socket]);

  const fetchChannels = async () => {
    try {
      const { data } = await api.get("/api/chat/channels");
      setChannels(data.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch channels");
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/api/chat/channels/${channelId}/messages`
      );
      setMessages(data.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    if (!currentChannel || !content.trim()) return;

    try {
      await api.post(`/api/chat/channels/${currentChannel}/messages`, {
        content,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to send message");
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/api/chat/messages/${messageId}`);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete message");
    }
  };

  const joinChannel = (channelId) => {
    if (socket && channelId) {
      socket.emit("join-channel", channelId);
      setCurrentChannel(channelId);
      fetchMessages(channelId);
    }
  };

  const handleTyping = (isTyping) => {
    if (socket && currentChannel) {
      socket.emit(isTyping ? "typing-start" : "typing-stop", currentChannel);
    }
  };


  useEffect(() => {
   
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
   
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

   
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
  
        if (error.response?.status === 401) {
      
          setError("Please login again");
        } else if (error.response?.status === 404) {
     
          setError("Resource not found");
        } else if (!error.response) {

          setError("Network error - please check your connection");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    socket,
    messages,
    channels,
    currentChannel,
    loading,
    error,
    typingUsers,
    sendMessage,
    deleteMessage,
    joinChannel,
    handleTyping,
    fetchChannels,
    user,
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
