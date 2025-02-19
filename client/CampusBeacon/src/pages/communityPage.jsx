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
import TextareaAutosize from "react-textarea-autosize";

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
      className="group flex items-start space-x-3 p-2 hover:bg-purple-500/10 rounded-lg"
    >
      <img
        src={
          userProfile?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`
        }
        alt={userProfile?.name || message.username}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">
              {userProfile?.name || message.username}
            </span>
            <span className="text-xs text-gray-400">
              {userProfile?.registration_number || ""}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {isOwnMessage && (
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="text-purple-400 hover:text-purple-300"
                title="Edit Message"
              >
                <Edit2 size={18} />
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
                className="text-red-500 hover:text-red-400"
                title="Delete Message"
              >
                <Trash size={18} />
              </motion.button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="mt-2">
            <input
              ref={editInputRef}
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-purple-500/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <div className="flex space-x-2 mt-2">
              <button
                type="submit"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-300 break-words">{message.content}</p>
        )}
      </div>
    </motion.div>
  );
};

// A small helper to remove duplicate messages by their IDs.
// (If your server returns the message again after you locally add it, this prevents duplicates.)
function removeDuplicateMessages(messages) {
  const unique = [];
  const seenIds = new Set();
  for (const m of messages) {
    if (!seenIds.has(m.id)) {
      seenIds.add(m.id);
      unique.push(m);
    }
  }
  return unique;
}

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
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
      name: "General Chat",
      icon: TiMessages,
      description: "Campus-wide discussions",
      color: "text-purple-500",
    },
    {
      id: "coding-doubts",
      name: "Coding Doubts",
      icon: FaCode,
      description: "Get help with programming questions",
      color: "text-pink-700",
    },
  ];

  // Filter channels for the sidebar search
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
    }
  };

  // Handle text input changes & trigger a typing indicator
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800">
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
                <>
                  <div className="flex items-center space-x-4">
                    <Hash className="w-6 h-6 text-purple-500" />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {channelList.find((c) => c.id === currentChannel)?.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {
                          channelList.find((c) => c.id === currentChannel)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                  {typingIndicator && (
                    <div className="text-sm text-purple-400 mt-1">
                      {typingIndicator}
                    </div>
                  )}
                </>
              ) : (
                <h3 className="text-xl font-bold text-white">
                  Select a channel to join conversation
                </h3>
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
    </div>
  );
};

export default CommunityPage;
