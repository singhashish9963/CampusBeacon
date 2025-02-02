import React, { useState, useEffect, useRef } from "react";
import { Hash, Search, Send, Users } from "lucide-react";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import {useNavigate} from "react-router-dom";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState({
    general: [],
    coding: [],
  });
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

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
      icon: TiMessages,
      description: "Campus-wide discussions",
      color: "text-purple-500",
    },
    {
      id: "coding",
      name: "Coding Doubts",
      icon: FaCode,
      description: "Get help with programming questions",
      color: "text-pink-700",
    },
  ];

  //Dummy messages for display purposes
  const mockMessages = {
    general: [
      {
        id: 1,
        user: {
          name: "Devansh",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        },
        content: "Hey everyone! Tomorrow maths class mass bunk?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        reactions: ["👋", "😊"],
      },
    ],
    coding: [
      {
        id: 1,
        user: {
          name: "Manya",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        },
        content: "Can anyone help with bit manupulation?",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        reactions: ["👨‍💻"],
        codeSnippet: "",
      },
    ],
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 bg-black/40 rounded-2xl backdrop-blur-xl border border-purple-500/20 overflow-hidden h-[85vh]">
          {/* Side Channel Bar */}
          <div className="col-span-3 border-r border-purple-500/20 p-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">
                  Community Channel
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/4 transform-transform y-1/2 text-gray-400 w-5 h-7" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    className="h-14 text-xl w-full bg-purple-500/10 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {/* Channel List */}
              <div className="space-y-2">
                {channels.map((channel) => (
                  <motion.div
                    key={channel.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-all h-20
                    ${
                      activeChannel === channel.id
                        ? "bg-purple-600/30 border border-purple 500/50"
                        : "hover:bg-purple-600/10"
                    }`}
                  >
                    <channel.icon className={`w-5 h-5 ${channel.color}`} />
                    <div className="text-left">
                      <p className="text-white font-m">{channel.name}</p>
                      <p className="text-gray-400 text-sm">
                        {channel.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}

          <div className="col-span-9 flex flex-col">
            <div className="p-4 border-b border-purple-500/30">
              <div className="flex items-center justify-between">
                <Hash className="w-6- h-6 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {channels.find((c) => c.id == activeChannel)?.name}
                  </h3>
                  <p className="text-gray-400 tezt-sm">
                    {channels.find((c) => c.id == activeChannel)?.description}
                  </p>
                </div>
              </div>
              {/* Displaying number of active users  */}
              <div className="flex items-center space-x-4">
                <Users className="w-5- h-6 text-purple-500" />
                <span className="text-green-400">19 online</span>
              </div>
            </div>
          </div>

          {/* Message area for messaging */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <>
                {messages[activeChannel].map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          {/* Message Input */}
          <div className="p-4 border-t border-purple-500/20">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-purple-500/20 text-purple-500"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </motion.button>
              <input
                type="text"
                placeholder={`Message #${activeChannel}`}
                className="flex-1 bg-purple-500/12 text-white rounded-lg px-4 py-2 focus-outline-none focus-ring-2 focus:ring-purple-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newMessage.trim()) {
                    setNewMessage("");
                  }
                }}
              />
              <motion.div 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="p-2 rounded-full bg-purple-500/20 text-purple-500"
               onClick={() => {
                if(newMessage.trim()){
                    setNewMessage("");
                }
               }}>
               <Send className="w-5 h-5" />
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommunityPage;
