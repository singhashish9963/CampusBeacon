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




}