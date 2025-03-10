import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { useAuth } from "./AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve all notifications with pagination support
  const getNotifications = useCallback(
    async (page = 1, limit = 20) => {
      if (!isAuthenticated) {
        console.log(
          "NotificationContext: getNotifications - Not authenticated"
        );
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log(
          "NotificationContext: getNotifications - Fetching notifications"
        );
        const response = await api.get("/notification", {
          params: { page, limit },
        });
        if (response.data.success) {
          console.log(
            "NotificationContext: getNotifications - Success:",
            response.data.data
          );
          setNotifications(response.data.data);
        } else {
          console.log(
            "NotificationContext: getNotifications - Error:",
            response.data.message
          );
          setError(response.data.message || "Failed to load notifications");
        }
      } catch (err) {
        console.error(
          "NotificationContext: getNotifications - Exception:",
          err
        );
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load notifications"
        );
      } finally {
        setLoading(false);
        console.log(
          "NotificationContext: getNotifications - Finally, loading:",
          loading
        );
      }
    },
    [isAuthenticated]
  );

  // Retrieve a single notification by ID.
  const getNotification = useCallback(
    async (id) => {
      if (!isAuthenticated) return null;
      setError(null);
      try {
        const response = await api.get(`/notification/${id}`);
        if (response.data.success) {
          return response.data.data;
        }
        setError(response.data.message || "Failed to retrieve notification");
        return null;
      } catch (err) {
        console.error("Error in getNotification:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to retrieve notification"
        );
        return null;
      }
    },
    [isAuthenticated]
  );

  // Create a new notification, handling file uploads if provided
  const createNotification = useCallback(
    async (data) => {
      if (!isAuthenticated) return null;
      setLoading(true);
      setError(null);
      try {
        let formData;
        let headers = { "Content-Type": "application/json" };
        if (data.file) {
          formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key === "file") {
              formData.append("file", data.file);
            } else {
              formData.append(key, data[key]);
            }
          });
          headers = { "Content-Type": "multipart/form-data" };
        }
        const response = await api.post(
          "/notification",
          formData ? formData : JSON.stringify(data),
          { headers }
        );
        if (response.data.success) {
          setNotifications((prev) => [response.data.data, ...prev]);
          return response.data.data;
        }
        setError(response.data.message || "Failed to create notification");
        return null;
      } catch (err) {
        console.error("Error in createNotification:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create notification"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Update an existing notification, handling file uploads if provided
  const updateNotification = useCallback(
    async (id, data) => {
      if (!isAuthenticated) return null;
      setLoading(true);
      setError(null);
      try {
        let formData;
        let headers = { "Content-Type": "application/json" };
        if (data.file) {
          formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key === "file") {
              formData.append("file", data.file);
            } else {
              formData.append(key, data[key]);
            }
          });
          headers = { "Content-Type": "multipart/form-data" };
        }
        const response = await api.put(
          `/notification/${id}`,
          formData ? formData : JSON.stringify(data),
          { headers }
        );
        if (response.data.success) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? response.data.data : n))
          );
          return response.data.data;
        }
        setError(response.data.message || "Failed to update notification");
        return null;
      } catch (err) {
        console.error("Error in updateNotification:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to update notification"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Delete a notification.
  const deleteNotification = useCallback(
    async (id) => {
      if (!isAuthenticated) return false;
      setLoading(true);
      setError(null);
      try {
        const response = await api.delete(`/notification/${id}`);
        if (response.data.success) {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          return true;
        }
        setError(response.data.message || "Failed to delete notification");
        return false;
      } catch (err) {
        console.error("Error in deleteNotification:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete notification"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Mark a single notification as read.
  const markNotificationAsRead = useCallback(
    async (id) => {
      if (!isAuthenticated) return null;
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/notification/${id}/read`);
        if (response.data.success) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? response.data.data : n))
          );
          return response.data.data;
        }
        setError(
          response.data.message || "Failed to mark notification as read"
        );
        return null;
      } catch (err) {
        console.error("Error in markNotificationAsRead:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to mark notification as read"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Mark all notifications as read.
  const markAllNotificationsAsRead = useCallback(async () => {
    if (!isAuthenticated) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/notification/read-all`);
      if (response.data.success) {
        // Update local state by marking all as read
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true, read_at: new Date() }))
        );
        return true;
      }
      setError(
        response.data.message || "Failed to mark all notifications as read"
      );
      return false;
    } catch (err) {
      console.error("Error in markAllNotificationsAsRead:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to mark all notifications as read"
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get unread notifications count.
  const getUnreadNotificationCount = useCallback(async () => {
    if (!isAuthenticated) return 0;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notification/unread/count`);
      if (response.data.success) {
        const count = response.data.data.unreadCount;
        setUnreadCount(count);
        return count;
      }
      setError(
        response.data.message || "Failed to get unread notifications count"
      );
      return 0;
    } catch (err) {
      console.error("Error in getUnreadNotificationCount:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to get unread notifications count"
      );
      return 0;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Auto-fetch notifications and unread count when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log(
        "NotificationContext: useEffect - User is authenticated, fetching notifications and unread count"
      );
      getNotifications();
      getUnreadNotificationCount();
    } else {
      console.log(
        "NotificationContext: useEffect - User is not authenticated, clearing notifications and count"
      );
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, getNotifications, getUnreadNotificationCount]);

  const notificationContextValue = {
    notifications,
    unreadCount,
    loading,
    error,
    getNotifications,
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    setNotifications,
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;
