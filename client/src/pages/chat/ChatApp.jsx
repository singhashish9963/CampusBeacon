import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../config/chatConfig/supabaseClient";
import {
  subscribeToMessages,
  subscribeToUsers,
} from "../../config/chatConfig/realTimeSubcription";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Edit,
  Trash2,
  Info,
  Image,
  ChevronDown,
  Hash,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Picker, { Theme } from "emoji-picker-react";

/**
 * Returns a random avatar URL using robohash.org.
 * @param {string} userId - Unique user identifier.
 */
const getAvatarURL = (userId) =>
  `https://robohash.org/${userId}?set=set4&size=150x150`;

const ChatApp = ({ channelId, channelName, darkMode, isAdmin }) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const { user: profileUser } = useSelector((state) => state.profile);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageContent, setEditingMessageContent] = useState("");
  // const [showEmoji, setShowEmoji] = useState(false); // Remove this line, replaced by showEmojiPicker
  const [isTyping, setIsTyping] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const chatBoxRef = useRef(null);
  const emojiPickerRef = useRef(null); // Ref for the emoji picker area

  // Pagination state
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesPerPage = 20;

  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker

  // Check if user can edit or delete a message
  const canModifyMessage = (message) => {
    if (!authUser) return false;
    if (isAdmin) return true;
    return message.userId === authUser.id;
  };

  // Fetch messages and subscribe to real-time updates.
  useEffect(() => {
    setMessages([]);
    setIsTyping(true);
    setCurrentPage(1);
    setHasMoreMessages(true);

    const fetchMessages = async () => {
      setIsTyping(true);
      setCurrentPage(1);
      setHasMoreMessages(true);

      try {
        const { data, error } = await supabase
          .from("Messages")
          .select("*")
          .eq("channelId", channelId)
          .order("createdAt", { ascending: false })
          .range(0, messagesPerPage - 1);

        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          setMessages(data.reverse());
          setHasMoreMessages(data.length === messagesPerPage);
        }
      } catch (err) {
        console.error("Error in message fetch:", err);
      } finally {
        setIsTyping(false);
      }
    };

    fetchMessages();

    const messageSubscription = subscribeToMessages(channelId, {
      onInsert: (newMessage) => {
        if (newMessage.channelId === channelId) {
          console.log("Adding new message to UI:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setTimeout(() => {
            if (chatBoxRef.current) {
              chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
          }, 100);
        }
      },
      onUpdate: (updatedMessage) => {
        if (updatedMessage.channelId === channelId) {
          console.log("Updating message in UI:", updatedMessage);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      },
      onDelete: (deletedMessage) => {
        console.log("Processing delete event for message:", deletedMessage);
        if (deletedMessage && deletedMessage.id) {
          console.log("Removing deleted message from UI:", deletedMessage.id);
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== deletedMessage.id)
          );
        }
      },
    });

    return () => {
      console.log("Cleaning up message subscription for channel:", channelId);
      supabase.removeChannel(messageSubscription);
    };
  }, [channelId]);

  // Handle scroll events for the chat box
  const handleChatScroll = (e) => {
    if (chatBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollButton(!isAtBottom);

      // Load more when reaching the top
      if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
        loadMoreMessages();
      }
    }
  };

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages || messages.length === 0) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startRange = currentPage * messagesPerPage;
    const endRange = startRange + messagesPerPage - 1;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data, error } = await supabase
        .from("Messages")
        .select("*")
        .eq("channelId", channelId)
        .order("createdAt", { ascending: false })
        .range(startRange, endRange);

      if (error) {
        console.error("Error loading more messages:", error);
      } else {
        if (data.length > 0) {
          const currentScrollHeight = chatBoxRef.current?.scrollHeight || 0;
          setMessages((prevMessages) => [...data.reverse(), ...prevMessages]);
          setCurrentPage(nextPage);

          // Maintain scroll position after loading older messages
          requestAnimationFrame(() => {
            if (chatBoxRef.current) {
              chatBoxRef.current.scrollTop =
                chatBoxRef.current.scrollHeight - currentScrollHeight;
            }
          });
        }
        setHasMoreMessages(data.length === messagesPerPage);
      }
    } catch (err) {
      console.error("Error in pagination:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Fetch users and subscribe to real-time updates.
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

    const usersSubscription = subscribeToUsers({
      onInsert: (newUser) => {
        setUsers((prev) => [...prev, newUser]);
      },
      onUpdate: (updatedUser) => {
        setUsers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
      },
      onDelete: (deletedUser) => {
        setUsers((prev) => prev.filter((user) => user.id !== deletedUser.id));
      },
    });

    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, []);

  // Handle sending a new message.
  const sendMessage = async () => {
    if (!newMessageContent.trim()) return;
    if (!authUser) {
      console.error("User not authenticated.");
      return;
    }

    const timestamp = new Date().toISOString();
    try {
      const { error } = await supabase.from("Messages").insert([
        {
          content: newMessageContent.trim(),
          userId: authUser.id,
          channelId,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setNewMessageContent("");
        setShowEmojiPicker(false); // Close emoji picker after sending
        document.getElementById("message-input")?.focus();
        setTimeout(() => {
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (err) {
      console.error("Error in message send:", err);
    }
  };

  // Trigger delete confirmation.
  const confirmAndDeleteMessage = (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!canModifyMessage(message)) {
      alert("You don't have permission to delete this message");
      return;
    }
    setDeleteConfirmation(messageId);
  };

  // Handle delete confirmation.
  const handleDeleteResponse = async (confirmed) => {
    if (confirmed && deleteConfirmation) {
      try {
        const messageToDelete = messages.find(
          (msg) => msg.id === deleteConfirmation
        );
        if (!canModifyMessage(messageToDelete)) {
          console.error("Permission denied: Cannot delete this message");
          return;
        }
        console.log(
          "Attempting to delete message:",
          deleteConfirmation,
          messageToDelete
        );
        const { error } = await supabase
          .from("Messages")
          .delete()
          .eq("id", deleteConfirmation);

        if (error) {
          console.error("Error deleting message:", error);
        } else {
          console.log("Message deleted successfully, updating UI immediately");
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== deleteConfirmation)
          );
        }
      } catch (err) {
        console.error("Error in message delete:", err);
      }
    }
    setDeleteConfirmation(null);
  };

  // Start editing a message
  const startEditingMessage = (message) => {
    if (!canModifyMessage(message)) {
      alert("You don't have permission to edit this message");
      return;
    }
    setEditingMessageId(message.id);
    setEditingMessageContent(message.content);
  };

  // Handle message editing.
  const updateMessage = async (messageId, newContent) => {
    if (!newContent.trim()) return;
    const messageToUpdate = messages.find((msg) => msg.id === messageId);
    if (!canModifyMessage(messageToUpdate)) {
      console.error("Permission denied: Cannot edit this message");
      return;
    }

    const timestamp = new Date().toISOString();
    try {
      const { error } = await supabase
        .from("Messages")
        .update({ content: newContent.trim(), updatedAt: timestamp })
        .eq("id", messageId);

      if (error) {
        console.error("Error updating message:", error);
      } else {
        setEditingMessageId(null);
        setEditingMessageContent("");
      }
    } catch (err) {
      console.error("Error in message update:", err);
    }
  };

  // Helper to format time.
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const timeOptions = { hour: "numeric", minute: "numeric" };
    const time = date.toLocaleTimeString([], timeOptions);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${time}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${time}`;
    } else {
      const dateOptions = { month: "short", day: "numeric" };
      return `${date.toLocaleDateString([], dateOptions)} at ${time}`;
    }
  };

  // Get full user data from the "users" state.
  const getUserData = (userId) => {
    // Kept but might be redundant with getUserFromMessage
    const found = users.find((u) => u.id === userId);
    if (found) return found;
    return {
      name: "Unknown User",
      registration_number: userId,
      avatar: getAvatarURL(userId),
    };
  };

  // Group messages by date for better organization
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  // Get user data from message
  const getUserFromMessage = useCallback(
    (message) => {
      const user = users.find((u) => u.id === message.userId);
      return {
        id: message.userId,
        name: user?.name || user?.email?.split("@")[0] || "Unknown User",
        registration_number: user?.registration_number || "",
        avatar: user?.avatar_url || getAvatarURL(message.userId),
      };
    },
    [users]
  );

  // Handle Emoji Selection
  const onEmojiClick = (emojiData, event) => {
    setNewMessageContent((prevInput) => prevInput + emojiData.emoji);
    // Optional: focus input after adding emoji
    document.getElementById("message-input")?.focus();
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div
      className={`flex flex-col h-full ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Channel Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center justify-between p-4 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } sticky top-0 z-10 backdrop-blur-sm ${
          darkMode ? "bg-gray-900/90" : "bg-white/90"
        }`}
      >
        {/* ... (header content remains the same) */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <Hash size={16} className="text-amber-500" />
          </div>
          <div>
            <h2 className="font-medium">{channelName}</h2>
            <p className="text-xs text-gray-400">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className={`p-2 rounded-md ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>
      </motion.div>

      {/* Chat Window */}
      <div
        className="flex-1 overflow-y-auto p-4 relative" // Added relative for loading indicator positioning
        onScroll={handleChatScroll}
        ref={chatBoxRef}
      >
        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 py-2 px-4 rounded-full bg-gray-500/50 text-white text-xs z-20 backdrop-blur-sm">
            Loading older messages...
          </div>
        )}

        {isTyping && messages.length === 0 ? (
          <div className="flex justify-center py-10">
            {/* ... (typing indicator) */}
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            {/* ... (no messages view) */}
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <Image size={24} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No messages yet</h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Be the first to send a message in #{channelName}!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                {/* Date Separator */}
                <div className="relative flex items-center py-2">
                  {/* ... (date separator) */}
                  <div
                    className={`flex-grow border-t border-dashed ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    } opacity-30`}
                  />
                  <span className="px-3 text-xs font-medium text-gray-400">
                    {new Date(date).toLocaleDateString([], {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <div
                    className={`flex-grow border-t border-dashed ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    } opacity-30`}
                  />
                </div>

                {dateMessages.map((message, index) => {
                  const user = getUserFromMessage(message);
                  const isCurrentUser = message.userId === authUser?.id;
                  const canModify = canModifyMessage(message);
                  const showAvatarAndName =
                    index === 0 ||
                    dateMessages[index - 1]?.userId !== message.userId ||
                    // Show avatar/name again if time gap is significant (e.g., > 5 minutes)
                    new Date(message.createdAt).getTime() -
                      new Date(dateMessages[index - 1]?.createdAt).getTime() >
                      5 * 60 * 1000;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`group flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[85%] ${
                          isCurrentUser ? "flex-row-reverse" : "flex-row"
                        } items-start space-x-2 ${
                          // Use items-start for avatar alignment
                          isCurrentUser ? "space-x-reverse" : ""
                        } ${showAvatarAndName ? "mt-2" : ""}`} // Add margin top for new user block
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-8 h-8">
                          {!isCurrentUser && showAvatarAndName && (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full rounded-full"
                            />
                          )}
                        </div>

                        {/* Message content */}
                        <div className="flex flex-col">
                          {/* Username and registration number */}
                          {showAvatarAndName && !isCurrentUser && (
                            <div className="flex items-baseline mb-1 ml-1">
                              <span className="text-sm font-medium mr-2">
                                {user.name}
                              </span>
                              {user.registration_number && (
                                <span className="text-xs text-gray-400">
                                  {user.registration_number}
                                </span>
                              )}
                              <span
                                className={`text-xs ${
                                  isCurrentUser
                                    ? "text-amber-200"
                                    : "text-gray-400"
                                } ml-2`}
                              >
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                          )}

                          {editingMessageId === message.id ? (
                            <div /* ... (editing view) */
                              className={`p-2 rounded-lg ${
                                darkMode ? "bg-gray-800" : "bg-gray-100"
                              }`}
                            >
                              <textarea
                                value={editingMessageContent}
                                onChange={(e) =>
                                  setEditingMessageContent(e.target.value)
                                }
                                className={`w-full p-2 rounded border ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-800"
                                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                                rows={2}
                                autoFocus
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  onClick={() => {
                                    setEditingMessageId(null);
                                    setEditingMessageContent("");
                                  }}
                                  className={`px-3 py-1 rounded text-sm ${
                                    darkMode
                                      ? "bg-gray-700 hover:bg-gray-600"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() =>
                                    updateMessage(
                                      message.id,
                                      editingMessageContent
                                    )
                                  }
                                  className="px-3 py-1 rounded text-sm bg-amber-500 hover:bg-amber-600 text-white"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : deleteConfirmation === message.id ? (
                            <div /* ... (delete confirmation view) */
                              className={`p-3 rounded-lg ${
                                darkMode ? "bg-gray-800" : "bg-gray-100"
                              }`}
                            >
                              <p className="text-sm mb-2">
                                Are you sure you want to delete this message?
                              </p>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleDeleteResponse(false)}
                                  className={`px-3 py-1 rounded text-sm ${
                                    darkMode
                                      ? "bg-gray-700 hover:bg-gray-600"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteResponse(true)}
                                  className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`relative group rounded-lg py-2 px-3 break-words ${
                                isCurrentUser
                                  ? "bg-amber-500 text-white rounded-br-none"
                                  : darkMode
                                  ? "bg-gray-800 rounded-bl-none"
                                  : "bg-gray-100 text-gray-800 rounded-bl-none"
                              } ${
                                showAvatarAndName
                                  ? ""
                                  : isCurrentUser
                                  ? "rounded-tr-lg"
                                  : "rounded-tl-lg"
                              } `} 
                            >
                              <p className="whitespace-pre-wrap">
                                {message.content}
                              </p>
                              {/* Show time inline only if avatar/name is not shown */}
                              {!showAvatarAndName && (
                                <span
                                  className={`text-xs ${
                                    isCurrentUser
                                      ? "text-amber-200"
                                      : "text-gray-400"
                                  } mt-1 ml-2 inline-block`}
                                >
                                  {formatTime(message.createdAt)}
                                  {message.updatedAt !== message.createdAt &&
                                    " (edited)"}
                                </span>
                              )}
                              {showAvatarAndName &&
                                message.updatedAt !== message.createdAt && (
                                  <span
                                    className={`text-xs ${
                                      isCurrentUser
                                        ? "text-amber-200"
                                        : "text-gray-400"
                                    } mt-1 ml-2 inline-block`}
                                  >
                                    (edited)
                                  </span>
                                )}

                              {/* Message actions */}
                              {canModify && (
                                <div
                                  className={`absolute top-0 ${
                                    isCurrentUser
                                      ? "left-0 -translate-x-full ml-[-4px]" // Adjust spacing
                                      : "right-0 translate-x-full mr-[-4px]" // Adjust spacing
                                  } flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity py-1`} // Add padding
                                >
                                  <button
                                    onClick={() => startEditingMessage(message)}
                                    className={`p-1.5 rounded-full ${
                                      darkMode
                                        ? "bg-gray-800/80 hover:bg-gray-700/90"
                                        : "bg-white/80 hover:bg-gray-100/90"
                                    } shadow backdrop-blur-sm`}
                                    title="Edit message"
                                  >
                                    <Edit size={14} className="text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmAndDeleteMessage(message.id)
                                    }
                                    className={`p-1.5 rounded-full ${
                                      darkMode
                                        ? "bg-gray-800/80 hover:bg-gray-700/90"
                                        : "bg-white/80 hover:bg-gray-100/90"
                                    } shadow backdrop-blur-sm`}
                                    title="Delete message"
                                  >
                                    <Trash2
                                      size={14}
                                      className="text-red-500"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
              }
            }}
            className={`absolute bottom-20 right-6 p-2 rounded-full shadow-lg ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100"
            } z-10`}
            title="Scroll to bottom"
          >
            <ChevronDown
              size={20}
              className={darkMode ? "text-amber-500" : "text-amber-600"}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message Input Area */}
      <div
        className={`p-4 border-t ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        } sticky bottom-0 z-10`}
      >
        {/* Emoji Picker Container - Positioned absolutely */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 z-20" // Position above input, aligned right
              ref={emojiPickerRef} 
            >
              <Picker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                theme={darkMode ? Theme.DARK : Theme.LIGHT}
                lazyLoadEmojis={true}

              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Row */}
        <div
          className={`relative flex items-center space-x-2 p-2 rounded-lg ${
            // Added relative for picker positioning context if needed
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
          ref={emojiPickerRef} // Attach ref to the entire input area + picker toggle
        >
          <button
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            title="Attach file"
          >
            <Paperclip size={18} className="text-gray-400" />
          </button>
          <input
            id="message-input"
            type="text"
            placeholder={`Message #${channelName}`} // Dynamic placeholder
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
              if (e.key === "Escape") {
                setShowEmojiPicker(false);
              }
            }}
            className={`flex-1 bg-transparent focus:outline-none ${
              darkMode
                ? "text-white placeholder-gray-400"
                : "text-gray-800 placeholder-gray-500"
            }`}
          />
          {/* Emoji Toggle Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            } ${
              showEmojiPicker ? (darkMode ? "bg-gray-700" : "bg-gray-200") : ""
            }`} 
            title={showEmojiPicker ? "Close emojis" : "Add emoji"}
          >
            {showEmojiPicker ? (
              <X size={18} className="text-gray-400" />
            ) : (
              <Smile size={18} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={sendMessage}
            disabled={!newMessageContent.trim()}
            className={`p-2 rounded-full transition-colors duration-150 ${
              newMessageContent.trim()
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
