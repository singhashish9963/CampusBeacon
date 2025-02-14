import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    if (welcomeMessage) {
      const timer = setTimeout(() => {
        setWelcomeMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/users/current");
      if (response.data?.data?.user) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
    return false;
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleAuth = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Making ${endpoint} request with:`, data);
      const response = await api.post(`/users${endpoint}`, data);

      if (response.data.success) {
        if (response.data.data && response.data.data.user) {
          const userData = response.data.data.user;
          setUser(userData);
          setIsAuthenticated(true);

          // Set appropriate welcome message
          if (endpoint === "/login") {
            if (!userData.isVerified) {
              setError("Please verify your email to continue.");
            } else {
              setWelcomeMessage(`Welcome back, ${userData.email}!`);
            }
          } else if (endpoint === "/signup") {
            setWelcomeMessage(
              "Welcome! Please check your email for verification instructions."
            );
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setWelcomeMessage(response.data.message || "");
        }
        return {
          success: true,
          user: response.data.data?.user || null,
          message: response.data.message,
        };
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error(`Auth error (${endpoint}):`, error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEmailVerification = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Starting email verification with token:", token);
      const response = await api.get(`/users/verify-email?token=${token}`);
      console.log("Verification response:", response.data);

      if (response.data.success && response.data.data?.user) {
        const userData = response.data.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        setWelcomeMessage(
          response.data.message || "Email verified successfully!"
        );
        return {
          success: true,
          user: userData,
          message: response.data.message,
        };
      }
      throw new Error(response.data.message || "Email verification failed");
    } catch (error) {
      console.error("Email verification error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(
    async (email, password) => handleAuth("/signup", { email, password }),
    [handleAuth]
  );

  const handleSignIn = useCallback(
    async (email, password) => handleAuth("/login", { email, password }),
    [handleAuth]
  );

  const handleForgetPassword = useCallback(
    async (email) => handleAuth("/forgot-password", { email }),
    [handleAuth]
  );

  const handleResetPassword = useCallback(
    async (token, newPassword) =>
      handleAuth("/reset-password", { token, newPassword }),
    [handleAuth]
  );

  const handleSubmit = useCallback(
    async (e, actionType) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      try {
        let response;
        switch (actionType) {
          case "signUp":
            response = await handleSignUp(
              formData.get("email"),
              formData.get("password")
            );
            break;
          case "signIn":
            response = await handleSignIn(
              formData.get("email"),
              formData.get("password")
            );
            break;
          case "forgotPassword":
            response = await handleForgetPassword(formData.get("email"));
            break;
          case "resetPassword":
            response = await handleResetPassword(
              formData.get("token"),
              formData.get("password")
            );
            break;
          default:
            throw new Error("Invalid action type");
        }
        if (!response.success) {
          throw new Error(response.message);
        }
        return response;
      } catch (error) {
        console.error("Form submission error:", error);
        setError(error.message);
        throw error;
      }
    },
    [handleSignUp, handleSignIn, handleForgetPassword, handleResetPassword]
  );

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/users/logout");

      if (window.socket) {
        window.socket.disconnect();
        window.socket = null;
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setWelcomeMessage("");
    }
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    error,
    loading,
    welcomeMessage,
    handleSubmit,
    handleSignIn,
    handleSignUp,
    handleLogout,
    handleForgetPassword,
    handleResetPassword,
    handleEmailVerification,
    checkAuthStatus,
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
