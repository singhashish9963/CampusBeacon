import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, X } from "lucide-react";
import { useMenu } from "../../contexts/hostelContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useOfficial } from "../../contexts/hostelContext";
import { useComplaints } from "../../contexts/hostelContext";
import { useNotifications } from "../../contexts/hostelContext";
const MenuPage = () => {
  const navigate = useNavigate();
  const { hostel_id } = useParams();
  const { menus, loading, error, fetchMenuByHostel, createMenu, updateMenuMeal } = useMenu();
  const { user, loading: authLoading, logout } = useAuth();
  const [hostelDetails, setHostelDetails] = useState(null);
  const [newMenu, setNewMenu] = useState({
    day: "",
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });
  const [selectedDay, setSelectedDay] = useState("");
  const [notification, setNotification] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    fetchMenuByHostel(hostel_id);
  }, [user, authLoading, hostel_id, fetchMenuByHostel]);

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
        console.error("Error fetching hostel details:", error.response || error);
      }
    };
    fetchHostelDetails();
  }, [hostel_id]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateMenu = async () => {
    if (!selectedDay || !newMenu.breakfast || !newMenu.lunch || !newMenu.snacks || !newMenu.dinner) {
      showNotification("Please fill all fields before submitting.", "error");
      return;
    }

    const existingMenu = menus.find((menu) => menu.day === selectedDay);
    if (existingMenu) {
      showNotification("Menu for this day already exists.", "error");
      return;
    }

    setMenuLoading(true);
    try {
      await createMenu({
        hostel_id,
        day: selectedDay,
        breakfast: newMenu.breakfast,
        lunch: newMenu.lunch,
        snacks: newMenu.snacks,
        dinner: newMenu.dinner,
      });
      showNotification("Menu created successfully!", "success");
      setNewMenu({
        day: "",
        breakfast: "",
        lunch: "",
        snacks: "",
        dinner: "",
      });
      setSelectedDay("");
    } catch (err) {
      console.error("Error creating menu:", err);
      showNotification("Error creating menu, please try again.", "error");
    } finally {
      setMenuLoading(false);
    }
  };

  const handleUpdateMeal = (day, mealType) => {
    const newMeal = prompt(`Enter new ${mealType}:`);
    if (newMeal) {
      updateMenuMeal(hostel_id, day, mealType, newMeal);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (authLoading) return <p>Checking authentication...</p>;
  if (!user) return null;
  if (!hostelDetails) return <p>Loading hostel details...</p>;

  const getCurrentMeal = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 19) return "Snacks";
    return "Dinner";
  };

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

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">Manage Hostel Menu</h1>

        {loading && <p className="text-center text-lg text-gray-500">Loading menus...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Create Menu Form */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 ml-30  mb-8 w-150">
          <h2 className="text-2xl text-white font-semibold mb-4">Create New Menu</h2>
          <div className="mb-4">
            <label htmlFor="day" className="block text-white text-lg font-medium mb-2">Day:</label>
            <input
              type="text"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border bg-white p-3 w-full rounded-lg"
              placeholder="Enter Day (e.g., Monday)"
            />
          </div>

          {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
            <div key={mealType} className="mb-4">
              <label className="block text-lg text-white font-medium mb-2">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</label>
              <input
                type="text"
                name={mealType}
                value={newMenu[mealType]}
                onChange={handleChange}
                className="border p-3 w-full bg-white rounded-lg"
                placeholder={`Enter ${mealType} menu`}
              />
            </div>
          ))}

          <button
            onClick={handleCreateMenu}
            className={`w-full p-3 rounded-lg text-white ${menuLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={menuLoading}
          >
            {menuLoading ? "Creating..." : "Create Menu"}
          </button>
        </div>

        {/* Menu List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Menus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.length > 0 ? (
              menus.map((menu) => (
                <div
                  key={menu.day}
                  className="border p-6 rounded-lg shadow-lg"
                  style={{
                    background: "linear-gradient(45deg,rgb(111, 143, 217),rgb(150, 93, 212),rgb(20, 161, 255))", // Gradient color
                    backgroundSize: "500% 500%",
                    animation: "gradient 5s ease infinite", // Optional animation for gradient
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 text-white">{menu.day}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Meal Columns */}
                    {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
                      <div key={mealType} className="border p-4 rounded-lg bg-white/60">
                        <h4 className="font-semibold">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                        <p>{menu[mealType] || "Not Set"}</p>
                        <div className="mt-2">
                          <button
                            onClick={() => handleUpdateMeal(menu.day, mealType)}
                            className="text-blue-500"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No menus found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




const OfficialPage = () => {
  const navigate = useNavigate();
  const { hostel_id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const {
    officials,
    fetchOfficialsByHostel,
    fetchOfficialById,
    createOfficial,
    editOfficial,
    deleteOfficial,
    loading: officialLoading,
  } = useOfficial();

  const [hostelDetails, setHostelDetails] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState(null); // Store single official data
  const [newOfficial, setNewOfficial] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
  });
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    fetchOfficialsByHostel(hostel_id);
  }, [user, authLoading, hostel_id, fetchOfficialsByHostel]);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const response = await api.get(`/hostels/hostels/${hostel_id}`);
        setHostelDetails(response.data);
      } catch (error) {
        console.error("Error fetching hostel details:", error.response || error);
      }
    };
    fetchHostelDetails();
  }, [hostel_id]);

  // Fetch specific official when editMode is active
  useEffect(() => {
    if (editMode) {
      fetchOfficialById(editMode)
        .then((data) => setSelectedOfficial(data))
        .catch((error) => console.error("Error fetching official:", error));
    }
  }, [editMode, fetchOfficialById]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateOrUpdateOfficial = async () => {
    if (!newOfficial.name || !newOfficial.email || !newOfficial.phone || !newOfficial.designation) {
      showNotification("Please fill all fields before submitting.", "error");
      return;
    }
  
    if (!hostel_id) {
      showNotification("Hostel ID is missing. Please try again.", "error");
      return;
    }
  
    try {
      console.log("Submitting Official Data:", { hostel_id, ...newOfficial });
  
      if (editMode) {
        await editOfficial(editMode, { hostel_id, ...newOfficial });
        showNotification("Official updated successfully!", "success");
      } else {
        const response = await createOfficial({ hostel_id, ...newOfficial });
        console.log("API Response:", response);
        showNotification("Official created successfully!", "success");
      }
  
      setNewOfficial({ name: "", email: "", phone: "", designation: "" });
      setEditMode(null);
      setSelectedOfficial(null);
    } catch (error) {
      console.error("Error saving official:", error);
      showNotification(error.response?.data?.message || "Error saving official, please try again.", "error");
    }
  };

  const handleEdit = async (official) => {
    setEditMode(official.official_id);
    setNewOfficial({
      name: official.name,
      email: official.email,
      phone: official.phone,
      designation: official.designation,
    });
  };

  const handleDelete = async (official_id) => {
    if (confirm("Are you sure you want to delete this official?")) {
      try {
        await deleteOfficial(official_id);
        showNotification("Official deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting official:", error.response?.data || error);
        showNotification("Error deleting official, please try again.", "error");
      }
    }
  };

  if (authLoading) return <p>Checking authentication...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8 flex justify-center items-center">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">
          Manage Hostel Officials
        </h1>

        {/* Form for Creating/Editing Officials */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8">
          <h2 className="text-2xl text-white font-semibold mb-4">
            {editMode ? "Edit Official" : "Create New Official"}
          </h2>
          <input
            type="text"
            name="designation"
            value={newOfficial.designation}
            onChange={(e) => setNewOfficial({ ...newOfficial, designation: e.target.value })}
            placeholder="Enter Designation"
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          <input
            type="text"
            name="name"
            value={newOfficial.name}
            onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
            placeholder="Enter Name"
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          <input
            type="email"
            name="email"
            value={newOfficial.email}
            onChange={(e) => setNewOfficial({ ...newOfficial, email: e.target.value })}
            placeholder="Enter Email (Unique)"
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          <input
            type="text"
            name="phone"
            value={newOfficial.phone}
            onChange={(e) => setNewOfficial({ ...newOfficial, phone: e.target.value })}
            placeholder="Enter Phone (10-12 characters)"
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          <button
            onClick={handleCreateOrUpdateOfficial}
            className={`w-full p-3 rounded-lg text-white ${officialLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={officialLoading}
          >
            {officialLoading ? "Processing..." : editMode ? "Update Official" : "Create Official"}
          </button>
        </div>

        {/* Officials List */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
          <h2 className="text-2xl text-white font-semibold mb-4">Officials List</h2>
          {officialLoading ? (
            <p className="text-white">Loading officials...</p>
          ) : (
            <ul className="text-white">
              {officials.length > 0 ? (
                officials.map((official) => (
                  <li key={official.official_id} className="border-b py-4 flex flex-col">
                    <span className="text-xl font-bold text-purple-400">{official.designation}</span>
                    <span className="text-lg font-semibold">{official.name}</span>
                    <span className="text-sm">Email: {official.email}</span>
                    <span className="text-sm">Phone: {official.phone}</span>
                    <div className="space-x-2 mt-2">
                      <button onClick={() => handleEdit(official)} className="text-yellow-400">Edit</button>
                      <button onClick={() => handleDelete(official.official_id)} className="text-red-400">Delete</button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No officials found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};




const ComplaintPage = () => {
  const navigate = useNavigate();
  const { hostel_id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { complaints = [], loading, fetchAllComplaints, createComplaint, editComplaint, deleteComplaint } = useComplaints();
  const [complaintData, setComplaintData] = useState({
    hostel_id: hostel_id || "",
    student_name: user?.name || "",
    student_email: user?.email || "",
    official_id: "",
    official_name: "",
    official_email: "",
    complaint_type: "",
    complaint_description: "",
    due_date: "",
  });

  const [editMode, setEditMode] = useState(null);
  const [officials, setOfficials] = useState([]);
  const [notification, setNotification] = useState(null); // Initialize the notification state

  const complaintTypes = [
    "Water Supply Problems", "Electricity Issues", "WiFi & Internet Problems", 
    "Cleanliness & Hygiene", "Pest Infestation", "Broken Infrastructure",
    "Poor Food Quality", "Insufficient Food Quantity", "Mess Timings",
    "Unhygienic Cooking Conditions", "Room Allocation Problems", "Overcrowding",
    "Roommate Conflicts", "Non-Functioning Fans/AC/Heaters", "Mattress & Bedding Issues",
    "Lack of Security Guards", "Unauthorized Visitors", "CCTV Not Working",
    "Theft & Lost Items", "Harassment or Bullying", "Unresponsive Warden/Admin",
    "Unfair Hostel Rules", "Late Fee Charges", "Laundry Issues", "Lack of Medical Assistance"
  ];

  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    fetchAllComplaints(hostel_id);
  }, [user, authLoading, hostel_id, fetchAllComplaints]);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const response = await api.get(`/hostels/officials/hostel/${hostel_id}`);
        setOfficials(response.data.data);
      } catch (error) {
        console.error("Error fetching officials:", error);
        setOfficials([]);
      }
    };
    fetchOfficials();
  }, [hostel_id]);

  const handleOfficialChange = (e) => {
    const selectedOfficial = officials.find(off => off.official_id === parseInt(e.target.value));
    if (selectedOfficial) {
      setComplaintData(prev => ({
        ...prev,
        official_id: selectedOfficial.official_id,
        official_name: selectedOfficial.name,
        official_email: selectedOfficial.email,
      }));
    }
  };

  const handleChange = (e) => {
    setComplaintData({ ...complaintData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintData.hostel_id || !complaintData.complaint_type || !complaintData.complaint_description) {
      setNotification({ message: "Please fill all fields before submitting.", type: "error" });
      return;
    }
    try {
      if (editMode) {
        await editComplaint(editMode, complaintData);
        setEditMode(null);
      } else {
        await createComplaint(complaintData);
      }
      setNotification({ message: "Complaint submitted successfully!", type: "success" });
      setComplaintData({
        hostel_id: hostel_id || "",
        student_name: user?.name || "",
        student_email: user?.email || "",
        official_id: "",
        official_name: "",
        official_email: "",
        complaint_type: "",
        complaint_description: "",
        due_date: "",
      });
    } catch (error) {
      setNotification({ message: "Error submitting complaint", type: "error" });
    }
  };

  const handleDelete = async (complaint_id) => {
    if (!complaint_id) {
      console.error("Complaint ID is missing!");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete complaint ID: ${complaint_id}?`)) return;
    try {
      await deleteComplaint(complaint_id);
      setNotification({ message: `Complaint ID: ${complaint_id} deleted successfully!`, type: "success" });
    } catch (error) {
      setNotification({ message: "Failed to delete complaint.", type: "error" });
    }
  };

  const handleUpdate = (complaint_id) => {
    const complaintToUpdate = complaints.find(complaint => complaint.complaint_id === complaint_id);
    if (complaintToUpdate) {
      setComplaintData({
        ...complaintToUpdate,
        official_id: complaintToUpdate.official_id,
        official_name: complaintToUpdate.official_name,
        official_email: complaintToUpdate.official_email,
      });
      console.log("Updating Complaint:", complaintToUpdate);
      setEditMode(complaint_id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8 flex justify-center items-center">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">
          Manage Complaints
        </h1>

        {/* Notification Display */}
        {notification && (
          <div className={`mb-6 p-4 text-white rounded-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
          </div>
        )}

        {/* Form for Creating/Editing Complaints */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8">
          <h2 className="text-2xl text-white font-semibold mb-4">{editMode ? "Edit Complaint" : "Create New Complaint"}</h2>
          
          <select
            name="official_id"
            value={complaintData.official_id}
            onChange={handleOfficialChange}
            className="border bg-white p-3 w-full rounded-lg mb-4"
          >
            <option value="">Select Official</option>
            {officials.map((official) => (
              <option key={official.official_id} value={official.official_id}>
                {official.name}
              </option>
            ))}
          </select>

          <select
            name="complaint_type"
            value={complaintData.complaint_type}
            onChange={handleChange}
            className="border bg-white p-3 w-full rounded-lg mb-4"
          >
            <option value="">Select Complaint Type</option>
            {complaintTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <textarea
            name="complaint_description"
            value={complaintData.complaint_description}
            onChange={handleChange}
            placeholder="Complaint Description"
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          
          <input
            type="date"
            name="due_date"
            value={complaintData.due_date? complaintData.due_date.split('T')[0] : ''}
            onChange={handleChange}
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />
          
          <button
            onClick={handleSubmit}
            className={`w-full p-3 rounded-lg text-white ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={loading}
          >
            {loading ? "Processing..." : editMode ? "Update Complaint" : "Submit Complaint"}
          </button>
        </div>

        {/* Complaints List */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
          <h2 className="text-2xl text-white font-semibold mb-4">Complaints List</h2>
          
          {loading ? (
            <p className="text-white">Loading complaints...</p>
          ) : (
            <ul className="text-white">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <li key={complaint.complaint_id} className="border-b py-4 flex flex-col">
                    <span className="text-xl font-bold text-purple-400">{complaint.complaint_type}</span>
                    <span className="text-lg font-semibold">{complaint.student_name} - {complaint.student_email}</span>
                    <span className="text-sm">{complaint.complaint_description}</span>
                    <span className="text-sm">Due Date: {complaint.due_date? complaint.due_date.split('T')[0] : ''}</span>
                    <div className="space-x-2 mt-2">
                      <button onClick={() => handleUpdate(complaint.complaint_id)} className="text-yellow-400 hover:text-yellow-600 transition-all">Edit</button>
                      <button onClick={() => handleDelete(complaint.complaint_id)} className="text-red-400 hover:text-red-600 transition-all">Delete</button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No complaints found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};



const NotificationsPage = () => {
  const navigate = useNavigate();
  const { hostel_id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { loading, error, createNotification, deleteNotification } = useNotifications();
  const [hostelDetails, setHostelDetails] = useState(null);
  const [notifications, setNotifications] = useState([]); 
  const [newNotification, setNewNotification] = useState({
    message: "",
    file: null
  });
  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login");
    } 
      fetchNotifications(hostel_id); 
  }, [user, authLoading, hostel_id]);

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
        console.error("Error fetching hostel details:", error.response || error);
      }
    };
    fetchHostelDetails();
  }, [hostel_id]);


  const handleCreateNotification = async () => {
    if (!newNotification.message) {
      showNotification("Please fill in the message.", "error");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('message', newNotification.message);
      formData.append('hostel_id', hostel_id);
  
      if (newNotification.file) {
        formData.append('file', newNotification.file);
      }
  
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
        withCredentials: true,
      });
  
      const response = await api.post('/hostels/notifications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setNewNotification({ message: "", file: null });
      showNotification("Notification created successfully!", "success");
  
      // Directly add the newly created notification to the state
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        response.data, // Assuming the response contains the new notification
      ]);
    } catch (error) {
      console.error("Error creating notification:", error);
      showNotification("Error creating notification, please try again.", "error");
    }
  };
  
  
  
  const fetchNotifications = async (hostel_id) => {
    try {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
        withCredentials: true,
      });
  
      const response = await api.get(`/hostels/notifications/${hostel_id}`);
      console.log("Fetched notifications:", response.data); // Log the fetched notifications
      setNotifications(response.data); // Update the state with fetched notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  
  useEffect(() => {
    fetchNotifications(hostel_id); 
    console.log("Fetching Notifications for Hostel ID:", hostel_id);
  }, [hostel_id]);
  
  useEffect(() => {
    console.log("Updated Notifications:", notifications);
  }, [notifications]);
  

  
  const showNotification = (message, type = "success") => {
    setNotifications((prevNotifications) => {
      const notificationsArray = Array.isArray(prevNotifications) ? prevNotifications : [];
            return [
        ...notificationsArray, 
        { message, type },
      ];
    });
  };
  
  const handleDeleteNotification = async (notification_id) => {
    if (!notification_id) {
      console.error("Notification ID is missing");
      return;
    }
  
    try {
      await deleteNotification(notification_id); // Assuming deleteNotification function uses the correct API endpoint
      showNotification("Notification deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting notification:", error.response || error);
      showNotification("Error deleting notification, please try again.", "error");
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
          <h2 className="text-2xl text-white font-semibold mb-4">Notifications</h2>
          <ul className="text-white">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li key={index} className="border-b py-4 flex flex-col">
      <span className="text-xl font-bold text-purple-400">{notification.message}</span>
      {notification.file_url && <img src={notification.file_url} alt="Notification image" />}
      <div className="space-x-2 mt-2">
        <button onClick={() => handleDeleteNotification(notification.notification_id)} className="text-red-400">
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
          <h2 className="text-2xl text-white font-semibold mb-4">Create New Notification</h2>
          <textarea
            placeholder="Enter Notification Message"
            className="border bg-white p-3 w-full rounded-lg mb-4"
            rows={4}
            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}          />
          <input
            type="file"
            className="border bg-white p-3 w-full rounded-lg mb-4"
            onChange={(e) => setNewNotification({ ...newNotification, file: e.target.files[0] })} />        
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



const HostelPage = () => {
  return (
    <div>
        <MenuPage />
        <OfficialPage />
        <ComplaintPage/>
       <NotificationsPage/>
      
    </div>
  )
}

export default HostelPage