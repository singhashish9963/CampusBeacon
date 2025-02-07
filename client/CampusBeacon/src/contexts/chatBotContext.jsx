import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ChatbotContext = createContext(null);

const api = axios.create({
  baseURL: "https://campusbeacon.onrender.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const ChatbotProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        else if (!err.response)
          setError("Network error - please check your connection.");
        return Promise.reject(err);
      }
    );
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const askQuestion = async (question) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/chatbot/ask", { question });
      setError(null);
      return data.data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to ask question");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    error,
    askQuestion,
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
