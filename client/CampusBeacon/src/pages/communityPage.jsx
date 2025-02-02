import React, { useState,useEffect } from "react";
import { Code, MessageSquare, Search } from "lucide-react";
import { motion } from "framer-motion";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState({
    general: [],
    coding: [],
  });
  const [newMessage, setNewMessage]= useState("");
  const [isLoading, setIsLoading]=useState(null);
  const [pinnedMessages, setPinnedMessages]=useState([]);
  const [showEmojiPicker, setShowEmojiPicker]=useState(false);

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

  //Dummy messages for display purposes

  useEffect() => {
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
          content:
            "Can anyone help with bit manupulation?",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          reactions: ["👨‍💻"],
          codeSnippet: `
            useEffect(() => {
              // My code here
            }, [dependency])
          `,
        },
        // Add more mock messages
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
                <h2 className="text-2xl font-bold text-white">
                  Community Channel
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/4 transform-transform y-1/2 text-gray-400 w-5 h-5 pr-1" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    className="w-full bg-purple-500/10 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-3 border-r border-purple-500/20 p-4"></div>
        </div>
      </div>
    </div>
  );
};
export default CommunityPage;
