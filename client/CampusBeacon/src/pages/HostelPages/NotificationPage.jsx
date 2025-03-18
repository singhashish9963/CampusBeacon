import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X, ChevronDown } from "lucide-react";
import { useHostelNotifications, useHostel } from "../../contexts/hostelContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { hostels, loading: hostelsLoading, fetchHostels } = useHostel();
  const {
    notifications,
    loading,
    error,
    fetchHostelNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
  } = useHostelNotifications();
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [hostelDetails, setHostelDetails] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [newNotification, setNewNotification] = useState({
    message: "",
    image: null
  });
  const [notification, setNotification] = useState(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [hostelSelectOpen, setHostelSelectOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  
  // Create API instance once
  const api = useMemo(() => axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }), []);

  // Authentication check and fetch hostels only once
  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login");
      return;
    }
    
    if (!hostelsLoading && !hostels.length) {
      fetchHostels();
    }
  }, [user, authLoading, navigate, fetchHostels, hostelsLoading, hostels.length]);

  // Fetch notifications only when selected hostel changes
  useEffect(() => {
    if (selectedHostel?.hostel_id) {
      fetchHostelNotifications(selectedHostel.hostel_id);
      fetchHostelDetails(selectedHostel.hostel_id);
    }
  }, [selectedHostel?.hostel_id]);

  // Memoized hostel details fetch function
  const fetchHostelDetails = useCallback(async (hostel_id) => {
    if (!hostel_id) return;
    
    try {
      const response = await api.get(`/hostels/hostels/${hostel_id}`);
      setHostelDetails(response.data);
    } catch (error) {
      console.error("Error fetching hostel details:", error.response || error);
    }
  }, [api]);

  // Notification display function
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Image upload handler
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setNewNotification(prev => ({
        ...prev,
        image: file
      }));
    }
  }, []);

  // Create/Update notification handler
  const handleCreateOrUpdateNotification = useCallback(async () => {
    if (!selectedHostel) {
      showNotification("Please select a hostel first", "error");
      return;
    }

    if (!newNotification.message) {
      showNotification("Please enter a message before submitting.", "error");
      return;
    }

    setNotificationLoading(true);
    try {
      const formData = new FormData();
      formData.append('hostel_id', selectedHostel.hostel_id);
      formData.append('message', newNotification.message);
      
      if (newNotification.image) {
        formData.append('image', newNotification.image);
      }

      if (editMode) {
        await updateNotification(editMode, formData);
        showNotification("Notification updated successfully!", "success");
      } else {
        await createNotification(formData);
        showNotification("Notification created successfully!", "success");
      }
      
      setNewNotification({
        message: "",
        image: null
      });
      setEditMode(null);
    } catch (err) {
      console.error("Error creating/updating notification:", err);
      showNotification("Error saving notification, please try again.", "error");
    } finally {
      setNotificationLoading(false);
    }
  }, [selectedHostel, newNotification, editMode, createNotification, updateNotification, showNotification]);

  // Edit notification handler
  const handleEdit = useCallback((notification) => {
    setEditMode(notification.notification_id);
    setNewNotification({
      message: notification.message,
      image: null
    });
  }, []);

  // Delete notification handler
  const handleDelete = useCallback(async (notification_id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(notification_id);
        showNotification("Notification deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting notification:", error.response?.data || error);
        showNotification("Error deleting notification, please try again.", "error");
      }
    }
  }, [deleteNotification, showNotification]);

  // Form input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Toggle hostel dropdown
  const toggleHostelSelect = useCallback(() => {
    setHostelSelectOpen(prev => !prev);
  }, []);

  // Select hostel handler
  const selectHostel = useCallback((hostel) => {
    setSelectedHostel(hostel);
    setHostelSelectOpen(false);
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  if (authLoading) return <p>Checking authentication...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8 flex justify-center items-center">
      <div className="w-full max-w-4xl p-6">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === "error" ? "bg-red-500" : "bg-green-500"}`}
            >
              <AlertCircle size={20} />
              <span>{notification.message}</span>
              <button onClick={dismissNotification} className="ml-2">
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">Manage Hostel Notifications</h1>

        {/* Hostel Selector */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
          <h2 className="text-2xl text-white font-semibold mb-4">Select Hostel</h2>
          
          {hostelsLoading ? (
            <p className="text-white">Loading hostels...</p>
          ) : (
            <div className="relative">
              <button 
                onClick={toggleHostelSelect}
                className="w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 text-left flex justify-between items-center"
              >
                <span>{selectedHostel ? selectedHostel.hostel_name : "Select a hostel"}</span>
                <ChevronDown size={20} className={`transition-transform duration-300 ${hostelSelectOpen ? "transform rotate-180" : ""}`} />
              </button>
              
              {hostelSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {hostels && hostels.length > 0 ? (
                    hostels.map(hostel => (
                      <div 
                        key={hostel.hostel_id} 
                        className="p-3 hover:bg-gray-700 cursor-pointer transition duration-200"
                        onClick={() => selectHostel(hostel)}
                      >
                        {hostel.hostel_name}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-400">No hostels found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedHostel ? (
          <>
            {loading && <p className="text-center text-lg text-gray-500">Loading notifications...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Create/Edit Notification Form */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
              <h2 className="text-2xl text-white font-semibold mb-4">
                {editMode ? "Edit Notification" : "Create New Notification"} for {selectedHostel.hostel_name}
              </h2>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Message:</label>
                <textarea
                  name="message"
                  value={newNotification.message}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg min-h-[100px]"
                  placeholder="Enter Notification Message"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Upload Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border bg-white p-3 w-full rounded-lg"
                />
              </div>

              <button
                onClick={handleCreateOrUpdateNotification}
                className={`w-full p-3 rounded-lg text-white ${notificationLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
                disabled={notificationLoading}
              >
                {notificationLoading
                  ? "Processing..."
                  : editMode
                  ? "Update Notification"
                  : "Create Notification"}
              </button>
            </div>

            {/* Notifications List */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Current Notifications for {selectedHostel.hostel_name}
              </h2>
              {loading ? (
                <p className="text-white">Loading notifications...</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.notification_id}
                        className="border rounded-lg p-4 shadow-lg"
                        style={{
                          background: "linear-gradient(45deg,rgb(111, 143, 217),rgb(150, 93, 212),rgb(20, 161, 255))",
                          backgroundSize: "500% 500%",
                          animation: "gradient 5s ease infinite",
                        }}
                      >
                        <div className="p-4 rounded-lg bg-white/60">
                          <p className="mb-4 text-gray-700">{notif.message}</p>
                          
                          {notif.file_url && (
                            <div className="mb-4">
                              <img 
                                src={notif.file_url} 
                                alt="Notification image" 
                                className="max-w-full rounded-lg" 
                              />
                            </div>
                          )}
                          
                          <div className="mt-4 flex space-x-4">
                            <button
                              onClick={() => handleEdit(notif)}
                              className="text-blue-600 hover:text-blue-800 transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(notif.notification_id)}
                              className="text-red-600 hover:text-red-800 transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white text-center py-4">No notifications found for this hostel.</p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-white p-10 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50">
            <p className="text-xl">Please select a hostel to manage its notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;