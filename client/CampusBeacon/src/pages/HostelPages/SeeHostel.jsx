import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Phone, Mail, Bell, Wrench, AlertCircle, X, Edit, Trash } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";
import { 
  useHostel, 
  useMenu, 
  useComplaints, 
  useOfficial, 
  useNotifications 
} from "../../contexts/hostelContext";

const SeeHostel = ({ hostelId }) => {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedComplaintType, setSelectedComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintDueDate, setComplaintDueDate] = useState("");
  const [currentHostel, setCurrentHostel] = useState(null);
  const [notification, setNotification] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState("");
  const [editMode, setEditMode] = useState(null);
  
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
  const { complaints, createComplaint, fetchAllComplaints, editComplaint, deleteComplaint } = useComplaints();
  const { officials, fetchOfficialsByHostel } = useOfficial();
  const { notifications, fetchHostelNotifications, createNotification, deleteNotification } = useNotifications();

  // Fetch hostel data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch hostels if not already loaded
      if (hostels.length === 0) {
        await fetchHostels();
      }
      
      // Fetch hostel-specific data
      await fetchMenuByHostel(hostelId);
      await fetchOfficialsByHostel(hostelId);
      await fetchHostelNotifications(hostelId);
      await fetchAllComplaints();
    };
    
    fetchData();
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, [hostelId]);

  // Set current hostel from hostels array
  useEffect(() => {
    if (hostels.length > 0) {
      const hostel = hostels.find(h => h.hostel_id === hostelId);
      setCurrentHostel(hostel);
    }
  }, [hostels, hostelId]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle official selection
  const handleOfficialChange = (e) => {
    setSelectedOfficial(e.target.value);
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedComplaintType("");
    setComplaintDescription("");
    setComplaintDueDate("");
    setSelectedOfficial("");
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
  const submitComplaint = async () => {
    if (!selectedComplaintType || !complaintDescription) {
      showNotification("Please fill all required fields", "error");
      return;
    }
    
    setComplaintLoading(true);
    
    try {
      // Find the selected official
      const official = officials.find(o => o.official_id.toString() === selectedOfficial);
      
      const complaintData = {
        hostel_id: hostelId,
        student_name: user?.name || "Anonymous",
        student_email: user?.email || "",
        official_id: official?.official_id || "",
        official_name: official?.name || "",
        official_email: official?.email || "",
        complaint_type: selectedComplaintType,
        complaint_description: complaintDescription,
        due_date: complaintDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      
      if (editMode) {
        // Edit existing complaint
        await editComplaint(editMode, complaintData);
        showNotification("Complaint updated successfully!", "success");
      } else {
        // Create new complaint
        await createComplaint(complaintData);
        
        // Create notification about the new complaint
        await createNotification({
          hostel_id: hostelId,
          message: `New ${selectedComplaintType} complaint filed`,
          type: "warning",
          timestamp: new Date().toISOString(),
        });
        
        showNotification("Complaint submitted successfully!", "success");
      }
      
      // Reset form fields
      resetForm();
      
    } catch (error) {
      console.error("Failed to submit complaint", error);
      showNotification("Failed to submit complaint. Please try again.", "error");
    } finally {
      setComplaintLoading(false);
    }
  };
  
  // Handle edit complaint
  const handleEdit = (complaint) => {
    setEditMode(complaint.complaint_id);
    setSelectedComplaintType(complaint.complaint_type);
    setComplaintDescription(complaint.complaint_description);
    setComplaintDueDate(complaint.due_date ? complaint.due_date.split('T')[0] : "");
    setSelectedOfficial(complaint.official_id.toString());
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
    complaint => complaint.hostel_id === hostelId
  );

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

        {currentHostel && (
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            {currentHostel.name}
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
                        Delete
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Wrench className="mr-2" /> File Complaint
              </h2>
              
              <select
                value={selectedComplaintType}
                onChange={(e) => setSelectedComplaintType(e.target.value)}
                className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white"
              >
                <option value="">Select Type</option>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              
              <textarea
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                placeholder="Describe your complaint"
                className="w-full p-2 bg-black/30 rounded-lg text-white h-24 mb-4"
              />
              
              <button
                onClick={submitComplaint}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                disabled={!selectedComplaintType || !complaintDescription}
              >
                Submit Complaint
              </button>
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
                      key={official.official_id || official.id}
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
            
{/* Recent Complaints */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
>
  <h2 className="text-white font-bold text-2xl flex items-center mb-4">
    <Bell className="mr-2" /> Recent Complaints
  </h2>
  
  {hostelComplaints.length > 0 ? (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {hostelComplaints
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
        .slice(0, 5)
        .map((complaint) => (
          <motion.div
            key={complaint.complaint_id}
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg border bg-black/30 border-purple-500/30"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-white font-medium">
                {complaint.complaint_type || complaint.complaintType}
              </h3>
              <span 
                className="text-xs px-2 py-1 rounded-full bg-yellow-500/30 text-yellow-200"
              >
                Pending
              </span>
            </div>
            <p className="text-gray-300 mt-2 text-sm line-clamp-2">
              {complaint.complaint_description || complaint.complaintDescription}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              {new Date(complaint.created_at || complaint.date).toLocaleString()}
            </p>
          </motion.div>
        ))}
    </div>
  ) : (
    <p className="text-white text-center">No complaints filed yet.</p>
  )}
</motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeHostel;