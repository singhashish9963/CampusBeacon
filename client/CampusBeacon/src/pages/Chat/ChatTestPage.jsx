import React, { useState } from "react";
import ChatApp from "./ChatApp";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Hash,
  Code,
  Bell,
  Zap,
  Users,
  Search,
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

const channels = [
  { id: 1, name: "General Chat", icon: <MessageSquare size={18} /> },
  { id: 2, name: "Random", icon: <Hash size={18} /> },
  { id: 3, name: "Tech Talk", icon: <Code size={18} /> },
  { id: 4, name: "MNNIT Announcements", icon: <Bell size={18} /> },
  { id: 5, name: "Sports Chat", icon: <Zap size={18} /> },
];

const ChatTestPage = () => {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showUserPanel, setShowUserPanel] = useState(false);

  // Mock user data
  const currentUser = {
    name: "John Doe",
    registration_number: "MNNIT/2023/B42",
    avatar: "/api/placeholder/40/40",
    status: "online",
  };

  // Filter channels based on search query
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white"
          : "bg-gradient-to-b from-gray-100 to-white text-gray-800"
      }`}
    >
      {/* Sidebar with channels */}
      <aside
        className={`w-64 ${
          darkMode ? "bg-gray-900/50" : "bg-gray-100"
        } border-r ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col`}
      >
        {/* App Header */}
        <div className="p-4 border-b border-gray-700">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-xl font-bold">MNNIT Chat</h1>
          </motion.div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div
            className={`flex items-center space-x-2 rounded-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-2`}
          >
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search channels"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">
            Channels
          </h2>
          <ul className="space-y-1">
            {filteredChannels.map((channel) => (
              <motion.li
                key={channel.id}
                whileHover={{ x: 4 }}
                className={`cursor-pointer rounded-md flex items-center justify-between p-2 ${
                  selectedChannel.id === channel.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : darkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center space-x-2">
                  {channel.icon}
                  <span>{channel.name}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } flex items-center justify-between cursor-pointer`}
          onClick={() => setShowUserPanel(!showUserPanel)}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-gray-900"></span>
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-500">
                {currentUser.registration_number}
              </p>
            </div>
          </div>
          <Settings size={16} className="text-gray-400" />
        </div>

        {/* User Panel (slides up when clicked) */}
        {showUserPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className={`absolute bottom-16 left-4 w-56 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-4 z-10 border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Appearance</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDarkMode(!darkMode);
                }}
                className="p-1 rounded-md bg-gray-700 text-gray-300"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
            <button className="flex items-center space-x-2 text-red-500 text-sm mt-4 w-full">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1">
        <ChatApp
          channelId={selectedChannel.id}
          channelName={selectedChannel.name}
          darkMode={darkMode}
          currentUser={currentUser}
        />
      </main>

      {/* Users Online Panel */}
      <aside
        className={`w-64 ${
          darkMode ? "bg-gray-900/50" : "bg-gray-100"
        } border-l ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } p-6 hidden lg:block`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Users size={18} />
          <h2 className="text-lg font-bold">Users Online</h2>
        </div>

        <div className="space-y-3">
          {/* Mock online users */}
          {[
            {
              name: "John Doe",
              registration_number: "MNNIT/2023/B42",
              status: "online",
            },
            {
              name: "Jane Smith",
              registration_number: "MNNIT/2022/A19",
              status: "idle",
            },
            {
              name: "Mike Johnson",
              registration_number: "MNNIT/2023/C78",
              status: "online",
            },
            {
              name: "Sara Williams",
              registration_number: "MNNIT/2021/D33",
              status: "offline",
            },
          ].map((user, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={`/api/placeholder/${40 + index}/${40 + index}`}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 ${
                    darkMode ? "border-gray-900" : "border-white"
                  } ${
                    user.status === "online"
                      ? "bg-green-500"
                      : user.status === "idle"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.registration_number}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default ChatTestPage;
