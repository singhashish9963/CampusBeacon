import React,{ createContext,useContext,useState,useEffect } from "react";
import io from "socket.io-client";
import {useAuth} from "./AuthContext"

const ChatContext = createContext(null); 

export const ChatContextProvider=({children})=>{
    const {user}= useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
     const [typingUsers, setTypingUsers] = useState(new Set());

   useEffect(() => {
     if (user?.id) {
       const newSocket = io(
          "http://localhost:5000",
         {
           withCredentials: true, 
         }
       );

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
        const response = await fetch("/api/chat/channels", {
          credentials: "include", // Important for cookies
        });

        if (!response.ok) throw new Error("Failed to fetch channels");

        const data = await response.json();
        setChannels(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchMessages = async (channelId) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/chat/channels/${channelId}/messages`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const sendMessage = async (content) => {
      if (!currentChannel || !content.trim()) return;

      try {
        const response = await fetch(
          `/api/chat/channels/${currentChannel}/messages`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content,
              timestamp: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to send message");
      } catch (error) {
        setError(error.message);
      }
    };

     const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete message');
    } catch (error) {
      setError(error.message);
    }
  };

  const joinChannel = (channelId) => {
    if (socket && channelId) {
      socket.emit('join-channel', channelId);
      setCurrentChannel(channelId);
      fetchMessages(channelId);
    }
  };

  const handleTyping = (isTyping) => {
    if (socket && currentChannel) {
      socket.emit(isTyping ? 'typing-start' : 'typing-stop', currentChannel);
    }
  };

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
    user 
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};


export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};






