import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Rocket, Send, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { askQuestion, clearError, resetSession } from "../../slices/chatbotSlice";

const ChatMessage = memo(({ msg, sessionId, onSimilarQuestionClick }) => {
  const handleSimilarClick = useCallback(
    (q) => {
      onSimilarQuestionClick(q);
    },
    [onSimilarQuestionClick]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] sm:max-w-[75%] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm break-words ${
          msg.sender === "user"
            ? "bg-purple-600 text-white rounded-br-lg"
            : msg.error
            ? "bg-red-500/20 text-red-300 border border-red-500/30 rounded-bl-lg"
            : "bg-indigo-600/50 text-white backdrop-blur-sm border border-indigo-400/20 rounded-bl-lg"
        }`}
      >
        {typeof msg.message === "string"
          ? msg.message.split("\n").map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))
          : String(msg.message)}

        {msg.confidence && typeof msg.confidence === "number" && !msg.error && (
          <div className="mt-1.5 opacity-70 text-xs">
            Confidence: {Math.round(msg.confidence * 100)}%
          </div>
        )}

        {msg.similarQuestions?.length > 0 && !msg.error && (
          <div className="mt-2 text-[11px] sm:text-xs bg-black/20 backdrop-blur-sm rounded-lg p-2 text-purple-200/90">
            <p className="font-medium mb-1 text-[10px] sm:text-xs opacity-80">Related Questions:</p>
            <ul className="space-y-1">
              {msg.similarQuestions.slice(0, 3).map((q, i) => (
                <li
                  key={i}
                  onClick={() => handleSimilarClick(q)}
                  className="cursor-pointer p-1.5 hover:bg-purple-500/20 rounded-md transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                  title={q}
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
});
ChatMessage.displayName = "ChatMessage";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();

  const { loading, error, sessionId } = useSelector((state) => ({
    loading: state.chatbot.loading,
    error: state.chatbot.error,
    sessionId: state.chatbot.sessionId,
  }));

  const chatHistoryKey = useMemo(() => `chatHistory_${sessionId || "default"}`, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      setChatHistory([]);
      return;
    }
    let savedHistory = [];
    try {
      const storedData = localStorage.getItem(chatHistoryKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          savedHistory = parsedData;
        } else {
          throw new Error("Stored chat history is not an array.");
        }
      }
    } catch (e) {
      console.error("Failed to load or parse saved chat history:", e);
      localStorage.removeItem(chatHistoryKey);
    }
    setChatHistory(savedHistory);
  }, [sessionId, chatHistoryKey]);

  useEffect(() => {
    if (!sessionId) return;
    try {
      if (chatHistory.length > 0) {
        localStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
      } else {
        localStorage.removeItem(chatHistoryKey);
      }
    } catch (e) {
      console.error("Failed to save chat history to localStorage:", e);
    }
  }, [chatHistory, sessionId, chatHistoryKey]);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      const scrollElement = chatContainerRef.current;
      requestAnimationFrame(() => {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [chatHistory, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const sendQuestion = useCallback(
    async (questionToSend) => {
      const trimmedQuestion = questionToSend.trim();
      if (!trimmedQuestion || loading) return;

      const newUserMessage = { sender: "user", message: trimmedQuestion };
      setChatHistory((prev) => [...prev, newUserMessage]);

      if (questionToSend === question) {
        setQuestion("");
      }

      dispatch(clearError());

      try {
        const result = await dispatch(
          askQuestion({ question: trimmedQuestion, sessionId: sessionId })
        ).unwrap();

        if (result?.answer) {
          setChatHistory((prev) => [
            ...prev,
            {
              sender: "chatbot",
              message: result.answer,
              similarQuestions: result.similarQuestions || [],
              category: result.category,
              confidence: result.confidence,
            },
          ]);
        } else {
          console.warn("Chatbot response missing 'answer' field:", result);
          setChatHistory((prev) => [
            ...prev,
            {
              sender: "chatbot",
              message: "I received your message but couldn't form a reply.",
              error: true,
            },
          ]);
        }
      } catch (err) {
        console.error("Chatbot askQuestion failed:", err);
        const errorMessage =
          err?.message || "Couldn't reach mission control. Please try again.";
        setChatHistory((prev) => [
          ...prev,
          { sender: "chatbot", message: errorMessage, error: true },
        ]);
      }
    },
    [dispatch, loading, sessionId, question]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      sendQuestion(question);
    },
    [sendQuestion, question]
  );

  const handleSimilarQuestionClick = useCallback(
    (similarQ) => {
      sendQuestion(similarQ);
    },
    [sendQuestion]
  );

  const handleResetChat = useCallback(() => {
    dispatch(resetSession());
  }, [dispatch]);

  const chatWindowVariants = {
    hidden: {
      y: "110%",
      opacity: 0,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 350, damping: 35 },
    },
  };
  const launchButtonVariants = {
    hidden: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 },
    },
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="launch-button"
            variants={launchButtonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-6 right-6 z-[60]"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all text-white focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center"
              aria-label="Open Chat"
              style={{ width: "48px", height: "48px" }}
            >
              <Rocket className="w-5 h-5 group-hover:animate-bounce" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed z-50 bottom-0 right-0 left-0 w-full h-[80vh] max-h-[650px] sm:bottom-20 sm:right-6 sm:left-auto sm:w-96 sm:h-[550px] sm:max-h-[85vh] md:bottom-24 md:h-[600px] bg-gradient-to-b from-gray-900/95 to-indigo-900/95 backdrop-blur-md shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col border border-purple-400/30"
            aria-modal="true"
            role="dialog"
            aria-labelledby="chatbot-heading"
          >
            <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-between flex-shrink-0 border-b border-purple-500/20">
              <div className="flex items-center gap-2 sm:gap-3">
                <Rocket className="w-5 h-5 text-white opacity-90" />
                <h3
                  id="chatbot-heading"
                  className="text-white font-semibold text-sm sm:text-base"
                >
                  Campus Assistant
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleResetChat}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  title="Reset conversation"
                  className="text-purple-200 hover:text-white focus:outline-none p-1 rounded-full focus:bg-purple-500/20"
                  aria-label="Reset chat session"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Close chat"
                  className="text-purple-200 hover:text-white focus:outline-none p-1 rounded-full focus:bg-purple-500/20"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-transparent scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent"
              aria-live="polite"
            >
              {chatHistory.length === 0 && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4 opacity-70">
                  <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400/80 animate-bounce" />
                  <p className="text-purple-200/90 text-sm sm:text-base">
                    Welcome! Ask me anything about campus.
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="flex justify-center my-2 px-2">
                  <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs sm:text-sm max-w-[90%]">
                    {error}
                  </div>
                </div>
              )}

              {chatHistory.map((msg, index) => (
                <ChatMessage
                  key={`${sessionId}-${index}-${msg.sender}`}
                  msg={msg}
                  sessionId={sessionId}
                  onSimilarQuestionClick={handleSimilarQuestionClick}
                />
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start pl-2 pt-2"
                >
                  <div className="bg-indigo-600/20 px-4 py-2.5 rounded-full">
                    <span className="inline-flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 sm:p-4 border-t border-purple-400/20 bg-gray-900/60 backdrop-blur-sm flex-shrink-0"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-grow px-4 py-2.5 sm:py-3 pr-12 bg-indigo-900/40 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/70 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  disabled={loading}
                  aria-label="Chat input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={loading || !question.trim()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-purple-400 hover:text-purple-300 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none rounded-full focus:bg-purple-500/20"
                  aria-label="Send message"
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
