import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const ChatbotContext = createContext(null);

const api = axios.create({
  baseURL:"http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const ChatbotProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a stable session ID to maintain conversation context
  const sessionId = useRef(
    localStorage.getItem("chatSessionId") ||
      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );

  useEffect(() => {
    // Save session ID to localStorage
    localStorage.setItem("chatSessionId", sessionId.current);

    const requestInterceptor = api.interceptors.request.use(
      (config) => config,
      (err) => Promise.reject(err)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response?.status === 401)
          setError("Unauthorized. Please log in.");
        else if (err.response?.status === 404) setError("Resource not found.");
        else if (err.response?.status === 429)
          setError("Too many requests. Please wait a moment and try again.");
        else if (!err.response)
          setError("Network error - please check your connection.");
        else
          setError(
            err.response?.data?.message || "An unexpected error occurred."
          );
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const clearError = () => setError(null);

  const askQuestion = async (question) => {
    setLoading(true);
    try {
      const { data } = await api.post(
        "/api/chatbot/ask",
        { question },
        { headers: { "x-session-id": sessionId.current } }
      );
      setError(null);
      return data.data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to ask question");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new session ID and clear the chat history
  const resetSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    sessionId.current = newSessionId;
    localStorage.setItem("chatSessionId", newSessionId);
    return newSessionId;
  };

  const value = {
    loading,
    error,
    askQuestion,
    clearError,
    resetSession,
    sessionId: sessionId.current,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context)
    throw new Error("useChatbot must be used within a ChatbotProvider");
  return context;
};

export default ChatbotContext;
