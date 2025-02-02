import React, {useState} from "react";
import { Code, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";


const CommunityPage =()=>{
    const currentUser = {
        id: "1",
        name: "Ayush Jadaun",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayush",
        role: "Student",
      };
      // Channels configuration
  const channels = [
    {
      id: "general",
      name: "General Chat",
      icon: MessageSquare,
      description: "Campus-wide discussions and announcements",
      color: "text-purple-500",
    },
    {
      id: "coding",
      name: "Coding Doubts",
      icon: Code,
      description: "Get help with programming questions",
      color: "text-pink-500",
    },
  ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800">
            
        </div>
    )
};
export default CommunityPage;
