import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../../contexts/chatBotContext"

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const { loading, error, askQuestion } = useChatbot();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: trimmedQuestion },
    ]);
    setQuestion("");

    try {
      const result = await askQuestion(trimmedQuestion);

      if (result?.answer) {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "chatbot",
            message: result.answer,
            similarQuestions: result.similarQuestions,
            category: result.category,
          },
        ]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "chatbot",
          message: "Sorry, I encountered an error. Please try again.",
          error: true,
        },
      ]);
    }
  };

  const handleSimilarQuestionClick = (question) => {
    setQuestion(question);
    handleSubmit({ preventDefault: () => {}, target: null });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleWidget}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? "Close Chat" : "Chat with CampusBeacon"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-6 z-50 w-80 max-h-[80vh] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <h3 className="text-white font-semibold">
                CampusBeacon Assistant
              </h3>
            </div>
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
            >
              {chatHistory.length === 0 ? (
                <p className="text-gray-400 text-sm text-center">
                  Hi! How can I help you with CampusBeacon today?
                </p>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "bg-purple-500 text-white"
                          : msg.error
                          ? "bg-red-100 text-red-500"
                          : "bg-pink-500 text-white"
                      }`}
                    >
                      {msg.message}
                      {msg.similarQuestions?.length > 0 && (
                        <div className="mt-2 text-xs">
                          <p className="font-semibold">Similar questions:</p>
                          <ul className="list-none space-y-1">
                            {msg.similarQuestions.map((q, i) => (
                              <li
                                key={i}
                                onClick={() => handleSimilarQuestionClick(q)}
                                className="cursor-pointer hover:bg-pink-600 p-1 rounded"
                              >
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-3 py-2 rounded-lg">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about CampusBeacon..."
                  className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-600 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
