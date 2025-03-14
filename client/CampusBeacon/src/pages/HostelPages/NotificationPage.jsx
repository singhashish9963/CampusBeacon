import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/hostelContext";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { hostel_id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const {
    loading,
    error,
    fetchNotifications,
    createNotification,
    deleteNotification,
  } = useNotifications();
  const [hostelDetails, setHostelDetails] = useState(null);
  const [notifications, setNotifications] = useState([]); // from context generally
  // New state for notification form data
  const [newNotification, setNewNotification] = useState({
    message: "",
    file: null,
  });

  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login");
    } else {
      fetchNotifications();
    }
  }, [user, authLoading, navigate, fetchNotifications]);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await api.get(`/hostels/hostels/${hostel_id}`);
        setHostelDetails(response.data);
      } catch (error) {
        console.error(
          "Error fetching hostel details:",
          error.response || error
        );
      }
    };
    fetchHostelDetails();
  }, [hostel_id]);

  const showNotification = (message, type = "success") => {
    // Here we'll simply log or display a notification message using console.warn/toast
    console.log(type, message);
  };

  const handleDeleteNotification = async (notification_id) => {
    try {
      await deleteNotification(notification_id);
      showNotification("Notification deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting notification:", error.response || error);
      showNotification(
        "Error deleting notification, please try again.",
        "error"
      );
    }
  };

  const handleCreateNotification = async () => {
    if (!newNotification.message) {
      showNotification("Please fill in the message.", "error");
      return;
    }
    try {
      await createNotification({
        hostel_id,
        ...newNotification,
      });
      showNotification("Notification created successfully!", "success");
      setNewNotification({ message: "", file: null });
    } catch (err) {
      console.error("Error creating notification:", err.response || err);
      showNotification(
        "Error creating notification, please try again.",
        "error"
      );
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8 flex justify-center items-center">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">
          Manage Hostel Notifications
        </h1>

        {/* Display Notifications */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Notifications
          </h2>
          <ul className="text-white">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li
                  key={notif.notification_id}
                  className="border-b py-4 flex flex-col"
                >
                  <span className="text-xl font-bold text-purple-400">
                    {notif.message}
                  </span>
                  {notif.file_url && (
                    <img src={notif.file_url} alt="Notification" />
                  )}
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={() =>
                        handleDeleteNotification(notif.notification_id)
                      }
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No notifications found.</p>
            )}
          </ul>
        </div>

        {/* Add Notification */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Create New Notification
          </h2>
          <textarea
            placeholder="Enter Notification Message"
            className="border bg-white p-3 w-full rounded-lg mb-4"
            rows={4}
            value={newNotification.message}
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                message: e.target.value,
              })
            }
          />
          <input
            type="file"
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                file: e.target.files[0],
              })
            }
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          <button
            onClick={handleCreateNotification}
            className="w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
          >
            Create Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
