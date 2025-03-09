import React, { useState, useEffect } from "react";
import ChatApp from "./ChatApp";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Hash,
  Code,
  Bell,
  Zap,
  Search,
  Settings,
  Moon,
  Sun,
  LogOut,
  BellRing,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/profileContext";

// Define available channels.
const channels = [
  { id: 1, name: "General Chat", icon: <MessageSquare size={18} /> },
  { id: 2, name: "Random", icon: <Hash size={18} /> },
  { id: 3, name: "Tech Talk", icon: <Code size={18} /> },
  { id: 4, name: "Announcements", icon: <Bell size={18} /> },
  { id: 5, name: "Sports", icon: <Zap size={18} /> },
];

// Array of dynamic fact and quote strings related to MNNIT
const mnnitFacts = [
  "MNNIT– Excellence in Engineering and Innovation",
  "Campus Festivities: Diwali, Holi, TechFest and Annual Cultural Fiesta",
  "MNNIT: Where tradition meets cutting-edge research",
  "Explore our state-of-the-art labs and creative minds",
  "MNNIT has a rich heritage and vibrant festival spirit",
  "Commitment, Creativity & Community – That’s MNNIT",
  "Drowned in knowledge, driven by passion: MNNIT",
];

const ChatTestPage = () => {
  const { user: authUser } = useAuth();
  const { user: profileUser } = useProfile();
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Dynamic fact displayed on the sidebar with interval 10 seconds
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === mnnitFacts.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Additional informational elements to be displayed in the sidebar
  const additionalInfo = [
    "MNNIT stands for Motilal Nehru National Institute of Technology.",
    "Located in Allahabad, we celebrate our heritage every festival season.",
    "Our campus is known for its academic excellence and innovation.",
    "Join events like TechFest, Cultural Fiesta, and Annual Sports Meet.",
  ];

  // Fetch current user data from backend (using auth and profile data)
  useEffect(() => {
    if (authUser && profileUser) {
      setCurrentUser({
        id: authUser.id,
        name: profileUser.name || authUser.email,
        registration_number:
          profileUser.registration_number || "Not registered",
        avatar:
          profileUser.avatar ||
          `https://robohash.org/${authUser.id}?set=set4&size=150x150`,
        status: "online",
      });
    }
  }, [authUser, profileUser]);

  // Filter channels based on search query.
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white"
          : "bg-gradient-to-b from-gray-100 to-white text-gray-800"
      }`}
    >
      {/* Left Sidebar */}
      <aside
        className={`w-full lg:w-64 flex-shrink-0 p-4 ${
          darkMode ? "bg-gray-900/70" : "bg-gray-100"
        } border-b lg:border-b-0 lg:border-r ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } flex flex-col justify-between`}
      >
        <div>
          {/* App Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                M
              </div>
              <h1 className="text-2xl font-bold">MNNIT Chat</h1>
            </motion.div>
            <button className="p-2 rounded-full hover:bg-gray-800">
              <BellRing size={20} className="text-white" />
            </button>
          </div>
          {/* Search Input */}
          <div className="mb-4">
            <div
              className={`flex items-center space-x-2 rounded-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              } px-4 py-2 shadow-md`}
            >
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search channels"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-md w-full"
              />
            </div>
          </div>
          {/* Channel List */}
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
              Channels
            </h2>
            <ul className="space-y-2">
              {filteredChannels.map((channel) => (
                <motion.li
                  key={channel.id}
                  whileHover={{ x: 4 }}
                  className={`cursor-pointer rounded-xl p-3 transition-all ${
                    selectedChannel.id === channel.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xl"
                      : darkMode
                      ? "hover:bg-gray-800/70"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <div className="flex items-center space-x-3">
                    {channel.icon}
                    <span className="font-medium">{channel.name}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          {/* Dynamic Fact Display */}
          <div className="p-4 bg-gray-800 rounded-xl shadow-inner">
            <p className="text-lg font-medium text-gray-200">
              {mnnitFacts[currentFactIndex]}
            </p>
          </div>
          {/* Additional MNNIT Info */}
          <div className="mt-4 space-y-2">
            {additionalInfo.map((info, idx) => (
              <p key={idx} className="text-sm text-gray-400">
                • {info}
              </p>
            ))}
          </div>
        </div>
        {/* Settings Panel */}
        <div
          className={`mt-8 p-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-300"
          } flex items-center justify-between cursor-pointer relative`}
          onClick={() => setShowUserPanel(!showUserPanel)}
        >
          {currentUser && (
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
              <div>
                <p className="text-lg font-medium">{currentUser.name}</p>
              </div>
            </div>
          )}
          <Settings size={20} className="text-gray-400" />
          <AnimatePresence>
            {showUserPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`absolute bottom-full left-4 w-60 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-2xl p-4 z-10 border ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-md font-semibold">Appearance</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDarkMode(!darkMode);
                    }}
                    className="p-2 rounded-full bg-gray-700 text-white"
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-red-600 text-white font-medium">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Middle Chat Area */}
      <main className="flex-1 bg-gray-900/60">
        {currentUser && (
          <ChatApp
            channelId={selectedChannel.id}
            channelName={selectedChannel.name}
            darkMode={darkMode}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Right Panel - Cosmic Dashboard */}
      <aside className="w-full lg:w-80 flex-shrink-0 bg-gray-900/70 border-t lg:border-t-0 lg:border-l border-gray-700 p-6 relative overflow-hidden">
        {/* Animated Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="w-full h-full bg-[url('/assets/stars.png')] bg-cover opacity-30 animate-pulse"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.5 }}
            transition={{ yoyo: Infinity, duration: 2 }}
          />
        </div>
        <div className="relative z-10">
          <motion.h2
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Cosmic Dashboard
          </motion.h2>
          <motion.div
            className="p-4 rounded-xl border border-amber-500 shadow-xl mb-6 animate-[borderGlow_3s_infinite]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-lg font-medium text-gray-200">
              {mnnitFacts[currentFactIndex]}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {(() => {
                const fact = mnnitFacts[currentFactIndex];
                if (fact.includes("Diwali") || fact.includes("Holi")) {
                  return "Celebrate the vibrant festivals of MNNIT with joy and unity.";
                }
                return `Experience the spirit of MNNIT: innovation, festivity, and academic excellence.`;
              })()}
            </p>
          </motion.div>
          <motion.div
            className="mt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <p className="text-sm text-gray-500">
              Our campus pulses with energy – from running lightning borders to
              gentle rains and twinkling stars. Discover the magic of MNNIT!
            </p>
          </motion.div>
        </div>
      </aside>
    </div>
  );
};

export default ChatTestPage;
