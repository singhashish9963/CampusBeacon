import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = "http://localhost:5000/notifications";

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setNotifications(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Create Notification (with Image Upload)
  const createNotification = async (hostel_id, message, file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("hostel_id", hostel_id);
      formData.append("message", message);
      if (file) {
        formData.append("file", file);
      }

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  // Update Notification (with Image Upload)
  const updateNotification = async (notification_id, hostel_id, message, file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("hostel_id", hostel_id);
      formData.append("message", message);
      if (file) {
        formData.append("file", file);
      }

      await axios.put(`${API_URL}/${notification_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update notification");
    } finally {
      setLoading(false);
    }
  };

  // Delete Notification
  const deleteNotification = async (notification_id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${notification_id}`);
      setNotifications(notifications.filter((n) => n.notification_id !== notification_id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        fetchNotifications,
        createNotification,
        updateNotification,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};