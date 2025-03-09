import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import supabase from "../../config/chatConfig/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

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

const ChatApp = ({ channelId }) => {
  const { user } = useAuth(); // Retrieves the current user from our custom backend via JWT cookies.
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageContent, setEditingMessageContent] = useState("");

  // Fetch initial messages and subscribe to real‑time updates.
  useEffect(() => {
    const fetchMessages = async () => {
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

  // Function to send a new message.
  const sendMessage = async () => {
    if (!newMessageContent.trim()) return;
    if (!user) {
      console.error("User not authenticated. Please sign in.");
      return;
    }

    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("Messages").insert([
      {
        content: newMessageContent.trim(),
        userId: user.id,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            Chat Channel: {channelId}
          </h2>
        </motion.div>

        {/* Chat Window */}
        <div className="bg-gray-800/30 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="h-96 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-400">No messages yet.</p>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-amber-400">
                    @{message.userId}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                {editingMessageId === message.id ? (
                  <>
                    <textarea
                      value={editingMessageContent}
                      onChange={(e) => setEditingMessageContent(e.target.value)}
                      className="w-full bg-gray-900/50 rounded-lg p-2 border border-gray-700 text-white mb-2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          updateMessage(message.id, editingMessageContent)
                        }
                        className="flex items-center space-x-1 py-1 px-3 bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L8 9.172V12h2.828l6.586-6.586a2 2 0 000-2.828z" />
                          <path
                            fillRule="evenodd"
                            d="M2 13.5V17h3.5l9.293-9.293-3.5-3.5L2 13.5zm3.5.5a.5.5 0 00-.5.5v.793l.5-.5H5v-.793z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingMessageId(null);
                          setEditingMessageContent("");
                        }}
                        className="flex items-center space-x-1 py-1 px-3 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M6 6l8 8M6 14L14 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300">{message.content}</p>
                    {/* Edit/Delete Buttons (only for the message owner) */}
                    {user && user.id === message.userId && (
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() => {
                            setEditingMessageId(message.id);
                            setEditingMessageContent(message.content);
                          }}
                          className="flex items-center space-x-1 py-1 px-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L8 9.172V12h2.828l6.586-6.586a2 2 0 000-2.828z" />
                            <path
                              fillRule="evenodd"
                              d="M2 13.5V17h3.5l9.293-9.293-3.5-3.5L2 13.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="flex items-center space-x-1 py-1 px-3 bg-red-600 rounded hover:bg-red-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v10a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 4a.5.5 0 011 0v7a.5.5 0 01-1 0V6zm4 0a.5.5 0 011 0v7a.5.5 0 01-1 0V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Type your message here..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            className="flex-1 bg-gray-900/50 rounded-lg p-4 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={sendMessage}
            className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg font-medium transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
