import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { handleApiCall } from "../services/userService.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Retrieve the stored user from localStorage (if available)
  const getStoredUser = () => {
    const userStorage = localStorage.getItem("authUser");
    if (userStorage) {
      try {
        return JSON.parse(userStorage);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    return null;
  };

  const [user, setUser] = useState(getStoredUser());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");


  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const handleAuth = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await handleApiCall(endpoint, data);
      if (response.success) {
    
        localStorage.setItem("authToken", response.data.token);
        setUser(response.data.user);
        setWelcomeMessage(`Welcome back!`);
        return {
          success: true,
          user: response.data.user,
          message: `Welcome back!`,
        };
      }
      setError(response.message);
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(
    (email, password) => handleAuth("/signup", { email, password }),
    [handleAuth]
  );

  const handleSignIn = useCallback(
    (email, password) => handleAuth("/login", { email, password }),
    [handleAuth]
  );

  const handleForgetPassword = useCallback(
    (email) => handleAuth("/forget-password", { email }),
    [handleAuth]
  );

  const handleResetPassword = useCallback(
    (email, password) => handleAuth("/reset-password", { email, password }),
    [handleAuth]
  );

  const handlePasswordAction = useCallback(
    async (e, actionType) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password =
        actionType === "resetPassword" ? formData.get("password") : "";
      try {
        const response =
          actionType === "forgotPassword"
            ? await handleForgetPassword(email)
            : await handleResetPassword(email, password);
        if (response?.success) {
          setWelcomeMessage(response.message || "Success!");
        } else {
          setError(response?.message || "Action failed.");
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [handleForgetPassword, handleResetPassword]
  );

  const handleSubmit = useCallback(
    async (e, actionType) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        const handlers = {
          signUp: handleSignUp,
          signIn: handleSignIn,
          forgetPassword: handleForgetPassword,
          resetPassword: handleResetPassword,
        };

        const handler = handlers[actionType];
        if (!handler) {
          throw new Error("Invalid action type");
        }

        const response = await handler(email, password);
        if (!response.success) {
          throw new Error(response.message || "Authentication failed");
        }

        return response;
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    [handleSignUp, handleSignIn, handleForgetPassword, handleResetPassword]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const contextValue = React.useMemo(
    () => ({
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
      handlePasswordAction,
      welcomeMessage,
    }),
    [
      user,
      error,
      loading,
      isSignUp,
      handleSubmit,
      handleSignIn,
      handleSignUp,
      handleAuth,
      logout,
      handlePasswordAction,
      welcomeMessage,
    ]
  );

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
