import React, { useState, useEffect, useRef } from "react";
import { Rocket, Stars, Moon, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../../contexts/ChatBotContext";

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
          message: "Houston, we have a problem. Please try again.",
          error: true,
        },
      ]);
    }
  };

  const handleSimilarQuestionClick = (similarQ) => {
    setQuestion(similarQ);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="group bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full shadow-lg hover:shadow-xl transition-all text-white font-semibold focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5" />
              <span>Close Mission Control</span>
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 group-hover:animate-bounce" />
              <span>Launch Assistant</span>
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-gradient-to-b from-gray-900 to-indigo-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-purple-400/30"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-white animate-pulse" />
                <Stars className="w-6 h-6 text-white" />
                <Moon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">
                Space Mission Control
              </h3>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-transparent"
            >
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Rocket className="w-16 h-16 text-purple-400 animate-bounce" />
                  <p className="text-purple-200 text-lg">
                    Ground Control to Major Tom...
                    <br />
                    How can I assist you today?
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white"
                          : msg.error
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "bg-indigo-600/40 text-white backdrop-blur-sm border border-indigo-400/30"
                      }`}
                    >
                      {msg.message}
                      {msg.similarQuestions?.length > 0 && (
                        <div className="mt-3 text-xs bg-white/10 backdrop-blur-sm rounded-xl p-3 text-purple-100">
                          <p className="font-semibold mb-2">
                            Related missions:
                          </p>
                          <ul className="space-y-1">
                            {msg.similarQuestions.map((q, i) => (
                              <li
                                key={i}
                                onClick={() => handleSimilarQuestionClick(q)}
                                className="cursor-pointer p-2 hover:bg-purple-500/30 rounded-lg transition-colors"
                              >
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-indigo-600/20 px-4 py-3 rounded-2xl">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-purple-400/30 bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Transmit your message..."
                  className="w-full px-4 py-3 pr-12 bg-indigo-900/30 border border-purple-400/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
                <motion.button
                  type="submit"
                  disabled={loading || !question.trim()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 disabled:opacity-50 focus:outline-none"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
