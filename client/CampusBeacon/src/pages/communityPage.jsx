import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Hash,
  Search,
  Send,
  Trash,
  Edit2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { useChat } from "../contexts/chatContext";
import { useAuth } from "../contexts/AuthContext";
import ChatBox from "../components/Chat/ChatBox";

// MessageBubble component
const MessageBubble = ({ message, onDelete, onEdit, isOwnMessage }) => {
  const { userProfiles } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const userProfile = userProfiles[message.userId];
  const editInputRef = useRef(null);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group mb-4 ${
        isOwnMessage ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"
      }`}
    >
      <div
        className={`flex items-start gap-10 ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-white/20"
          style={{ boxShadow: "0 0 10px rgba(138, 75, 175, 0.5)" }}
        >
          <img
            src={
              userProfile?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`
            }
            alt={userProfile?.name || message.username}
            className="w-full h-full object-cover"
          />
        </div>

        <div className={`flex-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`flex ${
                isOwnMessage ? "ml-auto" : ""
              } items-center gap-2`}
            >
              <span className="text-sm text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                {userProfile?.name || message.username}
              </span>
              {userProfile?.registration_number && (
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">
                  {userProfile.registration_number}
                </span>
              )}
            </div>
          </div>

          <div
            className={`relative p-4 rounded-2xl border border-gray-700/50 ${
              isOwnMessage
                ? "rounded-tr-none bg-gradient-to-br from-indigo-950/80 to-violet-900/80"
                : "rounded-tl-none bg-gradient-to-br from-gray-800/80 to-gray-900/80"
            }`}
            style={{ backdropFilter: "blur(8px)" }}
          >
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/40 border border-gray-700"
                />
                <div className="flex space-x-2 mt-2 justify-end">
                  <button
                    type="submit"
                    className="text-sm text-amber-400 hover:text-amber-300 px-3 py-1 bg-amber-500/10 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-300 px-3 py-1 bg-gray-500/10 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-100 break-words">{message.content}</p>
            )}

            {isOwnMessage && !isEditing && (
              <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 text-amber-400"
                  title="Edit Message"
                >
                  <Edit2 size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this message?"
                      )
                    ) {
                      onDelete(message.id);
                    }
                  }}
                  className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 text-red-400"
                  title="Delete Message"
                >
                  <Trash size={14} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
      </motion.div>

  );
};

// A small helper to remove duplicate messages by their IDs.
// (If your server returns the message again after you locally add it, this prevents duplicates.)
function removeDuplicateMessages(messages) {
  const unique = [];
  const seenIds = new Set();
  messages.forEach((m) => {
    if (!seenIds.has(m.id)) {
      seenIds.add(m.id);
      unique.push(m);
    }
  });
  return unique;
};

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const {
    messages,
    currentChannel,
    loading: isLoading,
    sendMessage,
    updateMessage,
    joinChannel,
    fetchChannels,
    handleTyping,
    typingIndicator,
    deleteMessage,
    fetchOlderMessages,
    hasMoreMessages,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
    const [optimisticMessageId, setOptimisticMessageId] = useState(null);


  // Prepare a channel list (could be dynamic in a real app).
  const channelList = [
    {
      id: "general",
      name: "Campus Connect",
      icon: TiMessages,
      description: "Campus-wide discussions & announcements",
      color: "from-amber-400 to-orange-600",
      members: 243,
      topics: ["Events", "Notices", "General"],
    },
    {
      id: "coding-doubts",
      name: "Code Lab",
      icon: FaCode,
      description: "Programming help & technical discussions",
      color: "from-blue-400 to-indigo-600",
      members: 189,
      topics: ["Algorithms", "Projects", "Languages"],
    },
  ];

  // Sidebar channel filtering.
  const filteredChannels = channelList.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check how close the user is to the bottom of the message list
  const checkIfNearBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const scrollPosition = scrollHeight - scrollTop - clientHeight;
      const newIsNearBottom = scrollPosition < 100;
      setIsNearBottom(newIsNearBottom);
      setShowScrollButton(!newIsNearBottom);
    }
  };

  // Smooth-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShouldScrollToBottom(true);
  };

  // Scroll event handler
  const handleScroll = () => {
    checkIfNearBottom();
  };

  // Fetch channels once when mounting
  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If we're near the bottom, scroll down when new messages arrive
  useEffect(() => {
    if (shouldScrollToBottom && isNearBottom) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, shouldScrollToBottom, isNearBottom]);

  // Attach the scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Called when the user presses the send button or hits Enter
  const handleSendMessage = () => {
    if (newMessage.trim()) {
          const tempId = Date.now().toString(); // Generate a temporary ID
            setOptimisticMessageId(tempId);
      setShouldScrollToBottom(true);
      sendMessage(newMessage, tempId); // Pass the tempId to sendMessage
      setNewMessage("");
      
      // Force scroll to bottom when sending a message, regardless of current position
      setAutoScrollPaused(false);
      setTimeout(() => scrollToBottom(), 50);
      
      // Clear optimistic message ID after a while
      setTimeout(() => setOptimisticMessageId(null), 500);
    }
  };

  // Handle typing input.
  const handleMessageInput = (e) => {
    setNewMessage(e.target.value);
    handleTyping(true);
  };

  // We remove duplicates here to avoid double-rendering if the server also
  // returns the newly added message.
  const uniqueMessages = useMemo(() => {
          // Filter out the optimistic message if it exists and the server has not yet returned it
          let filteredMessages = messages;
          if (optimisticMessageId) {
              filteredMessages = messages.filter(msg => msg.id !== optimisticMessageId);
          }
          return removeDuplicateMessages(filteredMessages);
      }, [messages, optimisticMessageId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1026] via-[#1A1B35] to-[#2C1B47] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 bg-black/40 rounded-2xl backdrop-blur-xl border border-purple-500/20 overflow-hidden h-[85vh]">
          {/* Sidebar */}
          <div className="col-span-3 border-r border-purple-500/20 p-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">
                  Community Channel
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    className="w-full bg-purple-500/10 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {filteredChannels.map((channel) => (
                  <motion.div
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => joinChannel(channel.id)}
                    className={`cursor-pointer p-4 rounded-lg flex items-center space-x-3 ${
                      currentChannel === channel.id
                        ? "bg-purple-600/30 border border-purple-500/50"
                        : "hover:bg-purple-600/10"
                    }`}
                  >
                    <channel.icon className={`w-5 h-5 ${channel.color}`} />
                    <div>
                      <p className="text-white font-medium">{channel.name}</p>
                      <p className="text-gray-400 text-sm">
                        {channel.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="col-span-9 flex flex-col">
            <div className="p-4 border-b border-purple-500/20">
              {currentChannel ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                        activeChannelInfo?.color ||
                        "from-amber-400 to-orange-600"
                      }`}
                    >
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {activeChannelInfo?.name ||
                            channelList.find((c) => c.id === currentChannel)
                              ?.name}
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleChannelInfo}
                          className="text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-amber-400 hover:bg-gray-700/80"
                        >
                          Info
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-gray-400 text-sm">
                          {activeChannelInfo?.description ||
                            channelList.find((c) => c.id === currentChannel)
                              ?.description}
                        </p>
                        {typingIndicator && (
                          <div className="text-sm text-amber-400 animate-pulse">
                            {typingIndicator}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden"
                        >
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${idx}`}
                            alt="Active user"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300">
                      {activeChannelInfo?.members ||
                        channelList.find((c) => c.id === currentChannel)
                          ?.members}{" "}
                      members
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <h3 className="text-xl font-bold text-white">
                    Select a channel to join the conversation
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Choose from the available channels on the left
                  </p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-2 relative"
              ref={messagesContainerRef}
            >
              {currentChannel ? (
                isLoading ? (
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
                    {uniqueMessages.map((message, index) => (
                      <MessageBubble
                        key={message.id || `${message.userId}-${index}`}
                        message={message}
                        isOwnMessage={user?.id === message.userId}
                        onDelete={deleteMessage}
                        onEdit={updateMessage}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-white font-medium">
                  Please select a channel from the sidebar.
                </div>
              )}

              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 p-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors"
                  >
                    <ChevronDown size={24} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            {currentChannel && (
              <div className="p-4 border-t border-purple-500/20">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder={`Message #${currentChannel}`}
                    className="flex-1 bg-purple-500/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    value={newMessage}
                    onChange={handleMessageInput}
                    onBlur={() => handleTyping(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    title="Send Message"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Channel Info Modal */}
      <AnimatePresence>
        {showInfoModal && activeChannelInfo && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-gray-900/90 rounded-xl p-6 w-full max-w-md border border-amber-500/30 z-50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${activeChannelInfo.color} flex items-center justify-center`}
                >
                  <activeChannelInfo.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-1">
                  {activeChannelInfo.name}
                </h2>
                <p className="text-gray-300 text-sm">
                  {activeChannelInfo.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-amber-400 font-medium mb-2">
                    Channel Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeChannelInfo.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-sm px-3 py-1 rounded-full bg-gray-800 text-gray-300"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-amber-400 font-medium mb-2">Members</h3>
                  <div className="flex items-center">
                    <div className="flex -space-x-3 mr-3">
                      {[1, 2, 3, 4].map((idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden"
                        >
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=member${idx}`}
                            alt="Member avatar"
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-gray-300">
                      {activeChannelInfo.members} members
                    </span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-amber-400 font-medium mb-2">
                    Channel Rules
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                    <li>Be respectful to other members</li>
                    <li>Stay on topic with the channel theme</li>
                    <li>No spam or promotional content</li>
                    <li>Share knowledge and help others</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;