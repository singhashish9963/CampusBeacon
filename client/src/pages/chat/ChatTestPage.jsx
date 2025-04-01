// React and third-party imports
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../config/chatConfig/supabaseClient";
import ChatApp from "./ChatApp";
import { useSelector } from "react-redux";
import {
  Hash,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const ChatTestPage = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const { user: profileUser } = useSelector((state) => state.profile);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [createChannelError, setCreateChannelError] = useState("");

  // Fetch channels and subscribe to real-time updates
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase
          .from("Channels")
          .select("*")
          .order("name");
          
        if (error) {
          console.error("Error fetching channels:", error);
        } else {
          setChannels(data);
          if (data.length > 0 && !selectedChannel) {
            setSelectedChannel(data[0]);
          }
        }
      } catch (err) {
        console.error("Error in channel fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();

    // Subscribe to real-time channel updates
    const channelSubscription = supabase
      .channel("channels-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Channels" },
        (payload) => {
          setChannels((prev) => [...prev, payload.new].sort((a, b) => a.name.localeCompare(b.name)));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Channels" },
        (payload) => {
          setChannels((prev) =>
            prev.map((channel) =>
              channel.id === payload.new.id ? payload.new : channel
            ).sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "Channels" },
        (payload) => {
          setChannels((prev) => 
            prev.filter((channel) => channel.id !== payload.old.id)
          );
          if (selectedChannel && selectedChannel.id === payload.old.id) {
            setSelectedChannel(prev[0] || null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(data);
        }
      } catch (err) {
        console.error("Error in user fetch:", err);
      }
    };

    fetchUsers();
  }, []);

  // Create a new channel
  const createChannel = async () => {
    if (!newChannelName.trim()) return;
    
    setCreateChannelError("");
    
    try {
      // Check the structure of the Channels table first
      const { data: channelStructure, error: structureError } = await supabase
        .from('Channels')
        .select('*')
        .limit(1);
        
      if (structureError) {
        console.error("Error checking channel structure:", structureError);
        setCreateChannelError("Could not verify channel structure");
        return;
      }
      
      // Create a new channel object based on the existing structure
      const newChannel = {
        name: newChannelName.trim(),
        description: `Channel for ${newChannelName.trim()} discussions`,
      };
      
      // Add createdBy field if it exists in the table structure
      if (channelStructure && channelStructure.length > 0 && 'createdBy' in channelStructure[0]) {
        newChannel.createdBy = authUser?.id || null;
      }
      
      // Add isPrivate field if it exists in the table structure
      if (channelStructure && channelStructure.length > 0 && 'isPrivate' in channelStructure[0]) {
        newChannel.isPrivate = false;
      }
      
      const { data, error } = await supabase
        .from('Channels')
        .insert([newChannel])
        .select();
      
      if (error) {
        console.error("Error creating channel:", error);
        setCreateChannelError(error.message);
      } else {
        setNewChannelName("");
        setShowCreateChannel(false);
        if (data && data.length > 0) {
          setSelectedChannel(data[0]);
        }
      }
    } catch (err) {
      console.error("Error in channel creation:", err);
      setCreateChannelError("An unexpected error occurred");
    }
  };

  // Filter channels based on search term
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current user data
  const currentUser = authUser ? {
    id: authUser.id,
    name: profileUser?.name || authUser.email?.split('@')[0] || "User",
    registration_number: profileUser?.registration_number || authUser.id,
    avatar: profileUser?.avatar_url || `https://robohash.org/${authUser.id}?set=set4&size=150x150`,
  } : null;

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-80 h-screen flex-shrink-0 fixed lg:relative z-40 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">Campus Beacon</h1>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-md ${
                      darkMode ? "bg-gray-700 text-amber-400" : "bg-gray-200 text-amber-600"
                    }`}
                  >
                    {darkMode ? "Light" : "Dark"}
                  </button>
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Channels List */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 flex justify-between items-center">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Channels
                  </h2>
                  <button
                    onClick={() => setShowCreateChannel(!showCreateChannel)}
                    className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Create Channel Form */}
                <AnimatePresence>
                  {showCreateChannel && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 mb-4 overflow-hidden"
                    >
                      <div className="p-3 rounded-md bg-gray-700">
                        <input
                          type="text"
                          placeholder="New channel name"
                          value={newChannelName}
                          onChange={(e) => setNewChannelName(e.target.value)}
                          className="w-full p-2 mb-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {createChannelError && (
                          <p className="text-red-400 text-xs mb-2">{createChannelError}</p>
                        )}
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setShowCreateChannel(false);
                              setCreateChannelError("");
                            }}
                            className="px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={createChannel}
                            className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse flex space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                ) : filteredChannels.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    No channels found. Try a different search term or create a new channel.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => {
                          setSelectedChannel(channel);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2 flex items-center space-x-2 rounded-md transition-colors ${
                          selectedChannel?.id === channel.id
                            ? "bg-amber-500/20 text-amber-400"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}
                      >
                        <Hash size={18} />
                        <span className="truncate">{channel.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="p-4 border-t border-gray-700">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{currentUser.name}</h3>
                        <p className="text-xs text-gray-400">
                          {currentUser.registration_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white">
                        <Settings size={18} />
                      </button>
                      <button className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white">
                        <LogOut size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-700 rounded"></div>
                        <div className="h-3 w-16 bg-gray-700 rounded mt-2"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <ChatApp
            channelId={selectedChannel.id}
            channelName={selectedChannel.name}
            darkMode={darkMode}
            currentUser={currentUser}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-800">
                <Hash size={24} className="text-amber-500" />
              </div>
              <h2 className="text-xl font-medium mb-2">No channel selected</h2>
              <p className="text-sm text-gray-400">
                Select a channel from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTestPage;
