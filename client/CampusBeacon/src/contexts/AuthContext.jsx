import React, { createContext, useState, useContext } from "react";
import { handleApiCall } from "../services/apiService"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (endpoint, data) => {
    try {
      const response = await handleApiCall(endpoint, data);
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        setUser(response.user);
      }
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = (email, password) =>
    handleAuth("/signup", { email, password });

  const handleSignIn = (email, password) =>
    handleAuth("/login", { email, password });

  const handleForgetPassword = (email) =>
    handleAuth("/forget-password", { email });

  const handleResetPassword = (email, password) =>
    handleAuth("/reset-password", { email, password });

  const handleSubmit = async (e, actionType) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password?.value;

    try {
      switch (actionType) {
        case "signUp":
          await handleSignUp(email, password);
          break;
        case "signIn":
          await handleSignIn(email, password);
          break;
        case "forgetPassword":
          await handleForgetPassword(email);
          break;
        case "resetPassword":
          await handleResetPassword(email, password);
          break;
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isSignUp,
        setIsSignUp,
        isForgetPassword,
        setIsForgetPassword,
        handleSubmit,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
