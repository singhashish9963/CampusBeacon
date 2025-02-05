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
    const [error, seterror] = useState(null);
    const [typingUser, setTypingUser] = useState(new Set());

    useEffect(()=>{
        if(user?.id){
            const newSocket= io("http://localhostL5000", {
                withCredentials: true
            })
        }
    })




}