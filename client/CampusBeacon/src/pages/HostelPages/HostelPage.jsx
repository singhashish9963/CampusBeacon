import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, X } from "lucide-react";
import { useMenu } from "../../contexts/hostelContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

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

export default MenuPage;
