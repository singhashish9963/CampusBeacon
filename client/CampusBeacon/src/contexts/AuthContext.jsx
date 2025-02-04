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


  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/users/current");
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      if (error.response?.status !== 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
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
   
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        setWelcomeMessage(
          `Welcome${endpoint === "/login" ? " back" : ""}, ${
            response.data.data.user.email
          }!`
        );

        return {
          success: true,
          user: response.data.data.user,
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

  const handleSignUp = useCallback(
    async (email, password) => {
      return handleAuth("/signup", { email, password });
    },
    [handleAuth]
  );

  const handleSignIn = useCallback(
    async (email, password) => {
      return handleAuth("/login", { email, password });
    },
    [handleAuth]
  );

  const handleForgetPassword = useCallback(
    async (email) => {
      return handleAuth("/forgot-password", { email });
    },
    [handleAuth]
  );

  const handleResetPassword = useCallback(
    async (token, newPassword) => {
      return handleAuth("/reset-password", { token, newPassword });
    },
    [handleAuth]
  );

  const handleSubmit = useCallback(
    async (e, actionType) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");

      try {
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
            response = await handleResetPassword(
              formData.get("token"),
              password
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
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear state
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
