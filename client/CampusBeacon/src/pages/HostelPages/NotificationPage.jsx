import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, X, ChevronDown } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useHostel, useNotifications } from "../../contexts/hostelContext";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { hostels, loading: hostelsLoading, fetchHostels } = useHostel();
  const { user, loading: authLoading } = useAuth();
  const {
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    createNotification, 
    deleteNotification
  } = useNotifications();
  
  const [hostelDetails, setHostelDetails] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [hostelSelectOpen, setHostelSelectOpen] = useState(false);
  
  // New state for notification form data
  const [newNotification, setNewNotification] = useState({
    message: "",
    file: null,
  });

  // Effect to check authentication and fetch hostels
  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    // Using fetchHostels from the context
    fetchHostels();
  }, [user, authLoading, navigate, fetchHostels]);

  // Effect to fetch notifications when selected hostel changes
  useEffect(() => {
    if (selectedHostel) {
      fetchNotifications(selectedHostel.hostel_id);
      fetchHostelDetails(selectedHostel.hostel_id);
    }
  }, [selectedHostel, fetchNotifications]);

  const fetchHostelDetails = async (hostel_id) => {
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
      console.error("Error fetching hostel details:", error.response || error);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteNotification = async (notification_id) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(notification_id);
        showNotification("Notification deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting notification:", error.response?.data || error);
        showNotification("Error deleting notification, please try again.", "error");
      }
    }
  };

  const handleCreateNotification = async () => {
    if (!selectedHostel) {
      showNotification("Please select a hostel first", "error");
      return;
    }

    if (!newNotification.message) {
      showNotification("Please fill in the message.", "error");
      return;
    }

    setNotificationLoading(true);
    try {
      await createNotification({
        hostel_id: selectedHostel.hostel_id,
        ...newNotification,
      });
      showNotification("Notification created successfully!", "success");
      setNewNotification({ message: "", file: null });
    } catch (err) {
      console.error("Error creating notification:", err.response || err);
      showNotification("Error creating notification, please try again.", "error");
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewNotification(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

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
              <button onClick={() => setNotification(null)} className="ml-2">
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">
          Manage Hostel Notifications
        </h1>

        {/* Hostel Selector */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
          <h2 className="text-2xl text-white font-semibold mb-4">Select Hostel</h2>
          
          {hostelsLoading ? (
            <p className="text-white">Loading hostels...</p>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setHostelSelectOpen(!hostelSelectOpen)}
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
                        onClick={() => {
                          setSelectedHostel(hostel);
                          setHostelSelectOpen(false);
                        }}
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

            {/* Create Notification Form */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Create New Notification for {selectedHostel.hostel_name}
              </h2>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Message:</label>
                <textarea
                  name="message"
                  placeholder="Enter Notification Message"
                  className="border bg-white p-3 w-full rounded-lg"
                  rows={4}
                  value={newNotification.message}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Attachment (optional):</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border bg-white p-3 w-full rounded-lg"
                />
              </div>

              <button
                onClick={handleCreateNotification}
                className={`w-full p-3 rounded-lg text-white ${notificationLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
                disabled={notificationLoading}
              >
                {notificationLoading ? "Processing..." : "Create Notification"}
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
                        <div className="bg-white/60 p-4 rounded-lg">
                          <h3 className="text-xl font-bold mb-2">{notif.message}</h3>
                          {notif.file_url && (
                            <div className="mb-2">
                              <img 
                                src={notif.file_url} 
                                alt="Notification" 
                                className="max-w-full h-auto rounded-lg"
                              />
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => handleDeleteNotification(notif.notification_id)}
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

export default NotificationsPage;