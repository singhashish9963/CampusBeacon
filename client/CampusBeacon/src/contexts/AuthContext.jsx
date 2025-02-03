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
  // Initialize states with proper typing
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [lastLoginTime, setLastLoginTime] = useState(null);


  useEffect(() => {
    checkAuthStatus();
  }, []);


  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          ...user,
          lastLoginTime: new Date().toISOString(),
        })
      );
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setLastLoginTime(userData.lastLoginTime);
        } catch (e) {
          console.error("Error parsing stored user data:", e);
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await handleApiCall(endpoint, data);

      if (response.success) {
        const currentTime = new Date().toISOString();
        const userData = {
          ...response.data.user,
          lastLoginTime: currentTime,
        };

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("authUser", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
        setLastLoginTime(currentTime);
        setWelcomeMessage(`Welcome back, ${userData.email || "user"}!`);

        return {
          success: true,
          user: userData,
          message: "Authentication successful",
        };
      }

      setError(response.message);
      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.message || "Authentication failed";
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
      return handleAuth("/forget-password", { email });
    },
    [handleAuth]
  );

  const handleResetPassword = useCallback(
    async (userId, token, newPassword) => {
      return handleAuth("/reset-password", {
        userId,
        token,
        newPassword,
      });
    },
    [handleAuth]
  );

  const handlePasswordAction = useCallback(
    async (e, actionType) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      try {
        let response;

        if (actionType === "forgotPassword") {
          response = await handleForgetPassword(formData.get("email"));
        } else if (actionType === "resetPassword") {
          response = await handleResetPassword(
            formData.get("userId"),
            formData.get("token"),
            formData.get("password")
          );
        }

        if (response?.success) {
          setWelcomeMessage(
            response.message || "Action completed successfully!"
          );
          return response;
        } else {
          throw new Error(response?.message || "Action failed");
        }
      } catch (error) {
        setError(error.message);
        throw error;
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
              formData.get("userId"),
              formData.get("token"),
              password
            );
            break;
          default:
            throw new Error("Invalid action type");
        }

        if (!response.success) {
          throw new Error(response.message || "Action failed");
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


      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLastLoginTime(null);
      setWelcomeMessage("");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      error,
      loading,
      welcomeMessage,
      lastLoginTime,
      handleSubmit,
      handleSignIn,
      handleSignUp,
      handleLogout,
      handlePasswordAction,
      handleForgetPassword,
      handleResetPassword,
    }),
    [
      user,
      isAuthenticated,
      error,
      loading,
      welcomeMessage,
      lastLoginTime,
      handleSubmit,
      handleSignIn,
      handleSignUp,
      handleLogout,
      handlePasswordAction,
      handleForgetPassword,
      handleResetPassword,
    ]
  );

  if (loading) {
    return <div>Loading...</div>; // update it
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
