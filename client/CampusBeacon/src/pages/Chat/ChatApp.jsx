import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../config/chatConfig/supabaseClient";
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
  Users,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/ProfileContext";
import { generateRandomAvatarURL } from "../../utils/avatarGenerator";

/**
 * Subscribe to real-time messages for a specific channel using Supabase's real-time API.
 * @param {number} channelId - Channel ID to subscribe to.
 * @param {function} callback - Callback invoked with new messages.
 * @returns Subscription object.
 */
const subscribeToMessages = (channelId, callback) => {
  const subscription = supabase
    .channel(`messages-channel-${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Messages",
        filter: `channelId=eq.${channelId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Subscribe to real-time updates for users table.
 * @param {function} callback - Callback invoked with new user data.
 * @returns Subscription object.
 */
const subscribeToUsers = (callback) => {
  const subscription = supabase
    .channel("users")
    .on(
      "postgres_changes",
      {
        event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "users",
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

const ChatApp = ({ channelId, channelName, darkMode }) => {
  const { user: authUser } = useAuth(); // Retrieves the current user from our custom backend via JWT cookies.
  const { user: profileUser } = useProfile(); // Get the profile information
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageContent, setEditingMessageContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Combine auth user and profile user data
  const currentUser =
    authUser && profileUser
      ? {
          id: authUser.id,
          name: profileUser.name || authUser.email,
          registration_number:
            profileUser.registration_number || "Not registered",
          avatar: profileUser.avatar || generateRandomAvatarURL(authUser.id),
        }
      : null;

  // Mock emoji picker
  const emojis = ["😊", "😂", "❤️", "👍", "🔥", "✨", "🎉", "🙌", "😎", "🤔"];

  // Fetch initial messages and subscribe to real‑time updates.
  useEffect(() => {
    const fetchMessages = async () => {
      // Show loading state
      setMessages([]);
      setIsTyping(true);

      // Simulate network delay
      setTimeout(async () => {
        const { data, error } = await supabase
          .from("Messages")
          .select("*")
          .eq("channelId", channelId)
          .order("createdAt", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          setMessages(data);
        }
        setIsTyping(false);
      }, 800);
    };

    fetchMessages();

    const subscription = subscribeToMessages(channelId, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup subscription on component unmount.
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  // Fetch initial users and subscribe to real-time updates.
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setOnlineUsers(data);
      }
    };

    fetchUsers();

    const usersSubscription = subscribeToUsers((payload) => {
      // Handle user updates based on the event type
      if (payload.event === "INSERT") {
        setOnlineUsers((prevUsers) => [...prevUsers, payload.new]);
      } else if (payload.event === "UPDATE") {
        setOnlineUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === payload.new.id ? payload.new : user
          )
        );
      } else if (payload.event === "DELETE") {
        setOnlineUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== payload.old.id)
        );
      }
    });

    // Cleanup subscription on component unmount.
    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, []);

  // Function to send a new message.
  const sendMessage = async () => {
    if (!newMessageContent.trim()) return;
    if (!authUser) {
      console.error("User not authenticated. Please sign in.");
      return;
    }

    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("Messages").insert([
      {
        content: newMessageContent.trim(),
        userId: authUser.id,
        channelId: channelId,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessageContent("");
    }
  };

  // Function to delete a message.
  const deleteMessage = async (messageId) => {
    const { error } = await supabase
      .from("Messages")
      .delete()
      .eq("id", messageId);
    if (error) {
      console.error("Error deleting message:", error);
    } else {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }
  };

  // Function to edit/update a message.
  const updateMessage = async (messageId, newContent) => {
    const timestamp = new Date().toISOString();
    const { error } = await supabase
      .from("Messages")
      .update({ content: newContent, updatedAt: timestamp })
      .eq("id", messageId);
    if (error) {
      console.error("Error updating message:", error);
    } else {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, content: newContent } : msg
        )
      );
      setEditingMessageId(null);
      setEditingMessageContent("");
    }
  };

  // Function to format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format time
    const timeOptions = { hour: "numeric", minute: "numeric" };
    const time = date.toLocaleTimeString([], timeOptions);

    // Check if it's today, yesterday, or earlier
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${time}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${time}`;
    } else {
      const dateOptions = { month: "short", day: "numeric" };
      return `${date.toLocaleDateString([], dateOptions)} at ${time}`;
    }
  };

  // Function to get user data
  const getUserData = (userId) => {
    // If the message is from the current user, use their profile info
    if (currentUser && userId === currentUser.id) {
      return currentUser;
    }

    const user = onlineUsers.find((user) => user.id === userId);
    if (user) {
      return user;
    }

    // Generate a random avatar URL if the user doesn't have one
    return {
      name: "Unknown User",
      registration_number: userId,
      avatar: generateRandomAvatarURL(userId),
    };
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div
      className={`h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white"
          : "bg-white text-gray-800"
      }`}
    >
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`py-4 px-6 flex justify-between items-center border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-md ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } flex items-center justify-center text-amber-500`}
          >
            <ChevronDown size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{channelName}</h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {messages.length} messages • {onlineUsers.length} members
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Info size={20} className="text-gray-400" />
          </button>
          <button
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>
      </motion.div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatWindowRef}>
        {isTyping ? (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animation-delay-400"></div>
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <div
                  className={`mx-auto w-16 h-16 rounded-full ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } flex items-center justify-center mb-4`}
                >
                  <Image size={24} className="text-amber-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Be the first to send a message in this channel!
                </p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="space-y-4">
                  <div className="relative flex items-center py-2">
                    <div
                      className={`flex-grow border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`px-3 text-xs font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(date).toLocaleDateString([], {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div
                      className={`flex-grow border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    ></div>
                  </div>

                  {dateMessages.map((message, i) => {
                    const userData = getUserData(message.userId);
                    const isFirstInGroup =
                      i === 0 || dateMessages[i - 1].userId !== message.userId;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${!isFirstInGroup ? "pl-12 mt-1" : ""}`}
                      >
                        {isFirstInGroup && (
                          <div className="flex items-center mb-1">
                            <img
                              src={userData.avatar}
                              alt={userData.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <span className="font-semibold">
                                {userData.name}
                              </span>
                              <span
                                className={`text-xs ml-2 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {userData.registration_number}
                              </span>
                              <span
                                className={`text-xs ml-2 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className={`${isFirstInGroup ? "pl-12" : ""}`}>
                          {editingMessageId === message.id ? (
                            <div
                              className={`p-3 rounded-lg ${
                                darkMode ? "bg-gray-800/80" : "bg-gray-100"
                              }`}
                            >
                              <textarea
                                value={editingMessageContent}
                                onChange={(e) =>
                                  setEditingMessageContent(e.target.value)
                                }
                                className={`w-full rounded-lg p-2 text-sm mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  darkMode
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-800"
                                }`}
                                rows={3}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    updateMessage(
                                      message.id,
                                      editingMessageContent
                                    )
                                  }
                                  className="flex items-center space-x-1 py-1 px-3 bg-amber-500 hover:bg-amber-600 rounded text-white text-sm transition-colors"
                                >
                                  <span>Save Changes</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingMessageId(null);
                                    setEditingMessageContent("");
                                  }}
                                  className={`flex items-center space-x-1 py-1 px-3 rounded text-sm transition-colors ${
                                    darkMode
                                      ? "bg-gray-700 hover:bg-gray-600"
                                      : "bg-gray-300 hover:bg-gray-400"
                                  }`}
                                >
                                  <span>Cancel</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="group">
                              <div className={`relative pb-1`}>
                                <p
                                  className={`${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                  }`}
                                >
                                  {message.content}
                                </p>

                                {authUser && authUser.id === message.userId && (
                                  <div
                                    className={`absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ${
                                      darkMode ? "bg-gray-800" : "bg-white"
                                    } rounded-full shadow-md p-1`}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditingMessageId(message.id);
                                        setEditingMessageContent(
                                          message.content
                                        );
                                      }}
                                      className={`p-1 rounded-full ${
                                        darkMode
                                          ? "hover:bg-gray-700"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      <Edit
                                        size={14}
                                        className="text-gray-500"
                                      />
                                    </button>
                                    <button
                                      onClick={() => deleteMessage(message.id)}
                                      className={`p-1 rounded-full ${
                                        darkMode
                                          ? "hover:bg-gray-700"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      <Trash2
                                        size={14}
                                        className="text-gray-500"
                                      />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className={`flex items-end ${showEmoji ? "mb-2" : ""}`}>
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`absolute bottom-20 left-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg p-3 z-10`}
              >
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNewMessageContent((prev) => prev + emoji);
                        setShowEmoji(false);
                      }}
                      className="text-xl p-1 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 flex">
            <div className="flex space-x-3 items-center px-3">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className={`p-2 rounded-full ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <Smile size={20} className="text-gray-400" />
              </button>
              <button
                className={`p-2 rounded-full ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <Paperclip size={20} className="text-gray-400" />
              </button>
            </div>

            <input
              type="text"
              placeholder={`Message #${channelName}`}
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className={`flex-1 p-3 rounded-md focus:outline-none ${
                darkMode
                  ? "bg-gray-800 text-white placeholder-gray-500"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              }`}
            />

            <button
              onClick={sendMessage}
              disabled={!newMessageContent.trim()}
              className={`ml-3 p-3 rounded-md transition-all ${
                newMessageContent.trim()
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : darkMode
                  ? "bg-gray-800 text-gray-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
