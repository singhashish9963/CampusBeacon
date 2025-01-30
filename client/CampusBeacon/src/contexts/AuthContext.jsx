import React, { createContext, useState, useContext } from "react";
import { handleApiCall } from "../services/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await handleApiCall(endpoint, data);

      if (response.success) {
        localStorage.setItem("authToken", response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      setError(response.message);
      return response; // { success: false, message: "Error message" }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
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

    let response;
    switch (actionType) {
      case "signUp":
        response = await handleSignUp(email, password);
        break;
      case "signIn":
        response = await handleSignIn(email, password);
        break;
      case "forgetPassword":
        response = await handleForgetPassword(email);
        break;
      case "resetPassword":
        response = await handleResetPassword(email, password);
        break;
      default:
        console.error("Invalid action type");
        return;
    }

    if (!response.success) {
      console.error("Form submission error:", response.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setError(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isSignIn: !!user,
        user,
        error,
        loading,
        isSignUp,
        setIsSignUp,
        handleSubmit,
        handleSignIn,
        handleSignUp,
        handleAuth,
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
