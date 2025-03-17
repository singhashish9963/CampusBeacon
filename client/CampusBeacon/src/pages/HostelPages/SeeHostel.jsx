import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Phone, Mail, Bell, Wrench, AlertCircle, X, Edit, Trash, ChevronDown } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";
import { 
  useHostel, 
  useMenu, 
  useComplaints, 
  useOfficial, 
  useNotifications 
} from "../../contexts/hostelContext";
import axios from "axios";

const SeeHostel = ({ hostelId }) => {
  const { user, loading: authLoading } = useAuth();
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notification, setNotification] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [officials, setOfficials] = useState([]);
  const [hostelDetails, setHostelDetails] = useState(null);
  const [showAllComplaints, setShowAllComplaints] = useState(false);
  
  // Complaint form state
  const [complaintData, setComplaintData] = useState({
    student_name: user?.name || "",
    student_email: user?.email || "",
    official_id: "",
    official_name: "",
    official_email: "",
    complaint_type: "",
    complaint_description: "",
    due_date: "", 
  });
  
  // Complaint types
  const complaintTypes = [
    "Water Supply Problems",
    "Electricity Issues",
    "WiFi & Internet Problems",
    "Cleanliness & Hygiene",
    "Pest Infestation",
    "Broken Infrastructure",
    "Poor Food Quality",
    "Insufficient Food Quantity",
    "Mess Timings",
    "Unhygienic Cooking Conditions",
    "Room Allocation Problems",
    "Overcrowding",
    "Roommate Conflicts",
    "Non-Functioning Fans/AC/Heaters",
    "Mattress & Bedding Issues",
    "Lack of Security Guards",
    "Unauthorized Visitors",
    "CCTV Not Working",
    "Theft & Lost Items",
    "Harassment or Bullying",
    "Unresponsive Warden/Admin",
    "Unfair Hostel Rules",
    "Late Fee Charges",
    "Laundry Issues",
    "Lack of Medical Assistance",
  ];

  // Days of week for menu display
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get contexts
  const { hostels, fetchHostels } = useHostel();
  const { menus, fetchMenuByHostel } = useMenu();
  const { complaints, loading, error, fetchAllComplaints, createComplaint, editComplaint, deleteComplaint } = useComplaints();
  const { notifications, fetchHostelNotifications, createNotification, deleteNotification } = useNotifications();

  // Create API instance
  const createApiInstance = () => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Fetch hostel data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch hostels if not already loaded
      if (hostels.length === 0) {
        await fetchHostels();
      }
      
      // Fetch hostel-specific data
      await fetchMenuByHostel(hostelId);
      await fetchHostelNotifications(hostelId);
      await fetchAllComplaints();
      console.log("Fetched complaints:", complaints); // Add this line

      // Fetch hostel details and officials
      await fetchHostelDetails(hostelId);
      await fetchOfficials(hostelId);
    };
    
    fetchData();
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, [hostelId]);

  // Fetch hostel details
  const fetchHostelDetails = async (hostelId) => {
    try {
      const api = createApiInstance();
      const response = await api.get(`/hostels/hostels/${hostelId}`);
      setHostelDetails(response.data);
    } catch (error) {
      console.error("Error fetching hostel details:", error.response || error);
    }
  };

  // Fetch officials
  const fetchOfficials = async (hostelId) => {
    try {
      const api = createApiInstance();
      const response = await api.get(`/hostels/officials/hostel/${hostelId}`);
      setOfficials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching officials:", error.response || error);
      setOfficials([]);
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle official change
  const handleOfficialChange = (e) => {
    const selectedOfficial = officials.find(
      (off) => off.official_id === parseInt(e.target.value)
    );
    if (selectedOfficial) {
      setComplaintData((prev) => ({
        ...prev,
        official_id: selectedOfficial.official_id,
        official_name: selectedOfficial.name,
        official_email: selectedOfficial.email,
      }));
    }
  };

  // Reset form fields
  const resetForm = () => {
    setComplaintData({
      student_name: user?.name || "",
      student_email: user?.email || "",
      official_id: "",
      official_name: "",
      official_email: "",
      complaint_type: "",
      complaint_description: "",
      due_date: "",
    });
    setEditMode(null);
  };

  // Get current meal based on time
  const getCurrentMeal = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 19) return "Snacks";
    return "Dinner";
  };

  // Get today's menu
  const getTodaysMenu = () => {
    const today = daysOfWeek[currentDay];
    return menus.find(menu => menu.day === today) || null;
  };

  // Handle complaint submission
  const handleCreateOrUpdateComplaint = async () => {
    if (!complaintData.complaint_type || !complaintData.complaint_description || !complaintData.official_id) {
      showNotification("Please fill all required fields before submitting.", "error");
      return;
    }
  
    setComplaintLoading(true);
    try {
      const complaintWithHostel = {
        ...complaintData,
        hostel_id: hostelId
      };
  
      if (editMode) {
        await editComplaint(editMode, complaintWithHostel);
        showNotification("Complaint updated successfully!", "success");
      } else {
        await createComplaint(complaintWithHostel);
        
        // Create notification about the new complaint
        await createNotification({
          hostel_id: hostelId,
          message: `New ${complaintData.complaint_type} complaint filed`,
          type: "warning",
          timestamp: new Date().toISOString(),
        });
        
        showNotification("Complaint created successfully!", "success");
      }
      
      // Refresh complaints data after submission
      await fetchAllComplaints();
      
      // Reset form
      resetForm();
    } catch (err) {
      console.error("Error creating/updating complaint:", err);
      showNotification("Error saving complaint, please try again.", "error");
    } finally {
      setComplaintLoading(false);
    }
  };

  // Handle edit complaint
  const handleEdit = (complaint) => {
    setEditMode(complaint.complaint_id);
    setComplaintData({
      student_name: complaint.student_name,
      student_email: complaint.student_email,
      official_id: complaint.official_id,
      official_name: complaint.official_name,
      official_email: complaint.official_email,
      complaint_type: complaint.complaint_type,
      complaint_description: complaint.complaint_description,
      due_date: complaint.due_date ? complaint.due_date.split('T')[0] : "",
    });
    // Scroll to complaint form
    window.scrollTo({
      top: document.getElementById('complaint-form').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  // Handle delete complaint
  const handleDelete = async (complaintId) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await deleteComplaint(complaintId);
        showNotification("Complaint deleted successfully!", "success");
      } catch (error) {
        console.error("Failed to delete complaint", error);
        showNotification("Failed to delete complaint. Please try again.", "error");
      }
    }
  };
  
  // Handle notification deletion
  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      showNotification("Notification deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting notification", error);
      showNotification("Failed to delete notification. Please try again.", "error");
    }
  };

  // Filter complaints for current hostel
  const hostelComplaints = complaints.filter(
    complaint => Number(complaint.hostel_id) === Number(hostelId)
);
  console.log("Filtered complaints:", hostelComplaints); // Add this line

  // Get today's menu
  const todaysMenu = getTodaysMenu();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        {/* Notification System */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              <AlertCircle size={20} />
              <span className="text-white">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-2 text-white">
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {hostelDetails && (
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            {hostelDetails.hostel_name}
          </h1>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Mess Menu, Notifications & Complaint */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mess Menu Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Utensils className="mr-2" /> Today's Mess Menu
                <span className="ml-4 text-lg text-purple-300">
                  {daysOfWeek[currentDay]}
                </span>
              </h2>
              
              {todaysMenu ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {todaysMenu.breakfast && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-lg border ${
                        getCurrentMeal() === "Breakfast"
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-black/30 border-white/10"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-white capitalize mb-3">
                        Breakfast
                      </h3>
                      <ul className="space-y-1">
                        {todaysMenu.breakfast.split(", ").map((item, index) => (
                          <li key={index} className="text-gray-300">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  
                  {todaysMenu.lunch && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-lg border ${
                        getCurrentMeal() === "Lunch"
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-black/30 border-white/10"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-white capitalize mb-3">
                        Lunch
                      </h3>
                      <ul className="space-y-1">
                        {todaysMenu.lunch.split(", ").map((item, index) => (
                          <li key={index} className="text-gray-300">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  
                  {todaysMenu.snacks && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-lg border ${
                        getCurrentMeal() === "Snacks"
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-black/30 border-white/10"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-white capitalize mb-3">
                        Snacks
                      </h3>
                      <ul className="space-y-1">
                        {todaysMenu.snacks.split(", ").map((item, index) => (
                          <li key={index} className="text-gray-300">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                 {todaysMenu.dinner && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-lg border ${
                        getCurrentMeal() === "Dinner"
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-black/30 border-white/10"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-white capitalize mb-3">
                        Dinner
                      </h3>
                      <ul className="space-y-1">
                        {todaysMenu.dinner.split(", ").map((item, index) => (
                          <li key={index} className="text-gray-300">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              ) : (
                <p className="text-white text-center">No menu available for today.</p>
              )}
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Bell className="mr-2" /> Notifications
              </h2>
              
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.notification_id || notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border ${
                        notif.type === "warning"
                          ? "bg-yellow-500/20 border-yellow-500"
                          : "bg-blue-500/20 border-blue-500"
                      } flex justify-between items-center`}
                    >
                      <div>
                        <p className="text-white">{notif.message}</p>
                        {notif.timestamp && (
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteNotification(notif.notification_id || notif.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-white text-center">No notifications at this time.</p>
              )}
            </motion.div>

            {/* Complaint Section */}
            <motion.div
              id="complaint-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Wrench className="mr-2" /> {editMode ? "Edit Complaint" : "File Complaint"}
              </h2>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Assign To Official:</label>
                <select
                  name="official_id"
                  value={complaintData.official_id}
                  onChange={handleOfficialChange}
                  className="border bg-black/30 text-white p-3 w-full rounded-lg"
                >
                  <option value="">Select Official</option>
                  {officials.map((official) => (
                    <option key={official.official_id} value={official.official_id}>
                      {official.name} - {official.designation}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Complaint Type:</label>
                <select
                  name="complaint_type"
                  value={complaintData.complaint_type}
                  onChange={handleChange}
                  className="border bg-black/30 text-white p-3 w-full rounded-lg"
                >
                  <option value="">Select Complaint Type</option>
                  {complaintTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Description:</label>
                <textarea
                  name="complaint_description"
                  value={complaintData.complaint_description}
                  onChange={handleChange}
                  className="border bg-black/30 text-white p-3 w-full rounded-lg"
                  placeholder="Detailed complaint description"
                  rows="4"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">Due Date:</label>
                <input
                  type="date"
                  name="due_date"
                  value={complaintData.due_date}
                  onChange={handleChange}
                  className="border bg-black/30 text-white p-3 w-full rounded-lg"
                />
              </div>

              <button
                onClick={handleCreateOrUpdateComplaint}
                className={`w-full p-3 rounded-lg text-white ${
                  complaintLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={complaintLoading}
              >
                {complaintLoading
                  ? "Processing..."
                  : editMode
                  ? "Update Complaint"
                  : "Submit Complaint"}
              </button>
              
              {editMode && (
                <button
                  onClick={resetForm}
                  className="w-full mt-2 p-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </motion.div>
          </div>

          {/* Right side: Officials and Recent Complaints */}
          <div className="space-y-8">
            {/* Officials Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-white font-bold text-2xl flex items-center mb-4">
                <FaUsersGear className="mr-2" /> Hostel Officials
              </h2>
              
              {officials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {officials.map((official) => (
                    <motion.div
                      key={official.official_id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-black/30 rounded-lg border border-purple-500/30"
                    >
                      <h3 className="text-white font-semibold">
                        {official.name}
                      </h3>
                      <p className="text-purple-300 text-sm">
                        {official.designation}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center mt-2">
                        <Phone className="mr-2 h-4 w-4" />
                        +91 {official.phone}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center mt-1">
                        <Mail className="mr-2 h-4 w-4" /> {official.email}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-white text-center">No officials information available.</p>
              )}
            </motion.div>
            
            {/* Recent Complaints Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-2xl flex items-center">
                  <Bell className="mr-2" /> Recent Complaints
                </h2>
                <button 
                  onClick={() => setShowAllComplaints(!showAllComplaints)}
                  className="text-purple-300 hover:text-white flex items-center text-sm"
                >
                  {showAllComplaints ? "Show Less" : "View All"}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showAllComplaints ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {hostelComplaints.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {hostelComplaints
                    .sort((a, b) => {
                      // Handle both date formats and ensure there's a valid date
                      const dateA = new Date(a.created_at || a.date || Date.now());
                      const dateB = new Date(b.created_at || b.date || Date.now());
                      return dateB - dateA;
                    })
                    .slice(0, showAllComplaints ? hostelComplaints.length : 5)
                    .map((complaint) => (
                      <motion.div
                        key={complaint.complaint_id}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-lg border bg-black/30 border-purple-500/30"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-medium">
                            {complaint.complaint_type}
                          </h3>
                          <span 
                            className="text-xs px-2 py-1 rounded-full bg-yellow-500/30 text-yellow-200"
                          >
                            Pending
                          </span>
                        </div>
                        <p className="text-gray-300 mt-2 text-sm line-clamp-2">
                          {complaint.complaint_description}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(complaint.created_at || complaint.date || Date.now()).toLocaleString()}
                        </p>
                        <div className="mt-2 flex space-x-4">
                          <button
                            onClick={() => handleEdit(complaint)}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                          >
                            <Edit className="h-3 w-3 inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(complaint.complaint_id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            <Trash className="h-3 w-3 inline mr-1" /> Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <p className="text-white text-center">No complaints filed yet.</p>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Full Complaints View Section */}
        {showAllComplaints && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6"
          >
            <h2 className="text-2xl text-white font-semibold mb-4">
              Current Complaints for {hostelDetails?.hostel_name}
            </h2>
            {loading ? (
              <p className="text-white">Loading complaints...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {hostelComplaints && hostelComplaints.length > 0 ? (
                  hostelComplaints.map((complaint) => (
                    <div
                      key={complaint.complaint_id}
                      className="border rounded-lg p-4 shadow-lg"
                      style={{
                        background: "linear-gradient(45deg,rgb(111, 143, 217),rgb(150, 93, 212),rgb(20, 161, 255))",
                        backgroundSize: "500% 500%",
                        animation: "gradient 5s ease infinite",
                      }}
                    >
                      <div className="bg-white/60 p-4 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">{complaint.complaint_type}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-gray-700 font-medium">Reported by:</span>
                            <span>{complaint.student_name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-700 font-medium">Assigned to:</span>
                            <span>{complaint.official_name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-700 font-medium">Due Date:</span>
                            <span>{complaint.due_date ? new Date(complaint.due_date).toLocaleDateString() : "Not specified"}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-700 font-medium">Description:</span>
                          <p className="mt-1">{complaint.complaint_description}</p>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => handleEdit(complaint)}
                            className="text-blue-600 hover:text-blue-800 transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(complaint.complaint_id)}
                            className="text-red-600 hover:text-red-800 transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center py-4">No complaints found for this hostel.</p>
                )}
              </div>
            )}
          </motion.div>
        )}
        </div>
    </div>
  );
};

export default SeeHostel;