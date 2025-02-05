import React,{ createContext,useContext,useState,useEffect } from "react";
import io from "socket.io-client";
import {useAuth} from "./AuthContext"

const chatContext= createContext(null);

export const chatContextProvider=({children})=>{
    const {user}= useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typingUser, setTypingUser] = useState(new Set());

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





}