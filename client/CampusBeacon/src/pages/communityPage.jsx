import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Hash, Search, Send, Trash, Edit2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { useChat } from "../contexts/chatContext";
import { useAuth } from "../contexts/AuthContext";
import TextareaAutosize from "react-textarea-autosize";

// MessageBubble component remains unchanged
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

// Helper function
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
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [optimisticMessageId, setOptimisticMessageId] = useState(null);
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState(null);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

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

  // Check if user is near bottom - improved with threshold calculation
  const checkIfNearBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const threshold = 100; // Increased threshold for better user experience
      
      const nearBottom = distanceFromBottom < threshold;
      setIsNearBottom(nearBottom);
      setShowScrollButton(!nearBottom);
      
      // If user manually scrolls up, pause auto-scrolling
      if (!nearBottom && !autoScrollPaused) {
        setAutoScrollPaused(true);
      }
      
      // If user manually scrolls to bottom, resume auto-scrolling
      if (nearBottom && autoScrollPaused) {
        setAutoScrollPaused(false);
      }
    }
  }, [autoScrollPaused]);
  
  // Scroll to bottom function with smooth animation option
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      if (smooth) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      } else {
        container.scrollTop = container.scrollHeight;
      }
      setShowScrollButton(false);
      setAutoScrollPaused(false);
    }
  }, []);

  // Fetch channels once when mounting
  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach scroll event listener to messages container
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfNearBottom);
      return () => container.removeEventListener("scroll", checkIfNearBottom);
    }
  }, [checkIfNearBottom]);

  // Improved message tracking and scroll behavior
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Don't process the same message twice
      if (lastMessage.id === lastProcessedMessageId) return;
      
      // Check if this is a new message
      const isNewMessage = lastProcessedMessageId !== null;
      const isUserMessage = lastMessage.userId === user?.id;
      const isOptimisticMessage = optimisticMessageId !== null;
      
      // Scroll conditions:
      // 1. Always scroll for user's own messages
      // 2. Scroll for new messages if user is near bottom and auto-scroll isn't paused
      // 3. Scroll on initial load
      // 4. Scroll for optimistic messages (being sent)
      const shouldScroll = 
        isUserMessage || 
        (isNewMessage && isNearBottom && !autoScrollPaused) || 
        (lastProcessedMessageId === null) || 
        isOptimisticMessage;
      
      if (shouldScroll) {
        scrollToBottom(isNewMessage && !isUserMessage); // Smooth scroll for others' messages
      }
      
      // Remember this message ID for next comparison
      setLastProcessedMessageId(lastMessage.id);
    }
  }, [messages, isLoading, isNearBottom, scrollToBottom, user?.id, lastProcessedMessageId, optimisticMessageId, autoScrollPaused]);

  // Force scroll on channel change
  useEffect(() => {
    if (currentChannel) {
      // Reset message tracking when channel changes
      setLastProcessedMessageId(null);
      setAutoScrollPaused(false);
      
      // Use a brief timeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [currentChannel, scrollToBottom]);

  // Called when the user presses the send button or hits Enter
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const tempId = Date.now().toString();
      setOptimisticMessageId(tempId);
      sendMessage(newMessage, tempId);
      setNewMessage("");
      
      // Force scroll to bottom when sending a message, regardless of current position
      setAutoScrollPaused(false);
      setTimeout(() => scrollToBottom(), 50);
      
      // Clear optimistic message ID after a while
      setTimeout(() => setOptimisticMessageId(null), 500);
    }
  };

  // Handle text input changes & trigger a typing indicator
  const handleMessageInput = (e) => {
    setNewMessage(e.target.value);
    handleTyping(true);
  };

  // Handle scroll button click
  const handleScrollButtonClick = () => {
    scrollToBottom(true); // Use smooth scrolling
  };

  // Remove duplicate messages
  const uniqueMessages = useMemo(() => {
    let filteredMessages = messages;
    if (optimisticMessageId) {
      filteredMessages = messages.filter(
        (msg) => msg.id !== optimisticMessageId
      );
    }
    return removeDuplicateMessages(filteredMessages);
  }, [messages, optimisticMessageId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 bg-black/40 rounded-2xl backdrop-blur-xl border border-purple-500/20 overflow-hidden h-[85vh]">
          {/* Sidebar with fixed header and scrollable channel list */}
          <div className="col-span-3 border-r border-purple-500/20 flex flex-col h-full">
            {/* Fixed sidebar header */}
            <div className="p-4 border-b border-purple-500/20 flex-shrink-0">
              <h2 className="text-3xl font-bold text-white">
                Community Channel
              </h2>
              <div className="relative mt-4">
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
            
            {/* Scrollable channel list */}
            <div className="flex-1 overflow-y-auto p-4">
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

          {/* Chat Section with fixed header, scrollable messages, and fixed input */}
          <div className="col-span-9 flex flex-col h-full">
            {/* Fixed chat header */}
            <div className="p-4 border-b border-purple-500/20 flex-shrink-0">
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

            {/* Chat content area with proper flexbox layout */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Scrollable messages area */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-transparent"
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
                      <div ref={messagesEndRef} className="h-px" />
                    </>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-white font-medium">
                    Please select a channel from the sidebar.
                  </div>
                )}
              </div>

              {/* Fixed message input at bottom */}
              {currentChannel && (
                <div className="p-4 border-t border-purple-500/20 bg-black/30 flex-shrink-0">
                  <div className="flex items-center space-x-4">
                    <TextareaAutosize
                      placeholder={`Message #${currentChannel}`}
                      className="flex-1 bg-purple-500/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none max-h-28"
                      value={newMessage}
                      onChange={handleMessageInput}
                      onBlur={() => handleTyping(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      minRows={1}
                      maxRows={4}
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
              
              {/* Scroll button - position adjusted for better visibility */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleScrollButtonClick}
                    className="absolute bottom-20 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-10"
                    title="Scroll to bottom"
                  >
                    <ChevronDown size={20} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;