import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X, ChevronDown } from "lucide-react";
import { useMenu, useHostel } from "../../contexts/hostelContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const MenuPage = () => {
  const navigate = useNavigate();
  const { hostels, loading: hostelsLoading, fetchHostels } = useHostel();
  const {
    menus,
    loading,
    error,
    fetchMenuByHostel,
    createMenu,
    updateMenuMeal,
  } = useMenu();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [hostelDetails, setHostelDetails] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
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
  const [hostelSelectOpen, setHostelSelectOpen] = useState(false);

  // Effect to check authentication and fetch hostels
  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    // Using fetchHostels from the context
    fetchHostels();
  }, [user, authLoading, navigate, fetchHostels]);

  // Effect to fetch menu when selected hostel changes
  useEffect(() => {
    if (selectedHostel) {
      fetchMenuByHostel(selectedHostel.hostel_id);
      fetchHostelDetails(selectedHostel.hostel_id);
    }
  }, [selectedHostel, fetchMenuByHostel]);

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

  const handleCreateMenu = async () => {
    if (!selectedHostel) {
      showNotification("Please select a hostel first", "error");
      return;
    }

    if (
      !selectedDay ||
      !newMenu.breakfast ||
      !newMenu.lunch ||
      !newMenu.snacks ||
      !newMenu.dinner
    ) {
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
        hostel_id: selectedHostel.hostel_id,
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
    if (!selectedHostel) {
      showNotification("Please select a hostel first", "error");
      return;
    }

    const newMeal = prompt(`Enter new ${mealType}:`);
    if (newMeal) {
      updateMenuMeal(selectedHostel.hostel_id, day, mealType, newMeal);
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

  const getCurrentMeal = () => {
    const currentTime = new Date();
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
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
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
          Manage Hostel Menu
        </h1>

        {/* Hostel Selector */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Select Hostel
          </h2>

          {hostelsLoading ? (
            <p className="text-white">Loading hostels...</p>
          ) : (
            <div className="relative">
              <button
                onClick={() => setHostelSelectOpen(!hostelSelectOpen)}
                className="w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 text-left flex justify-between items-center"
              >
                <span>
                  {selectedHostel
                    ? selectedHostel.hostel_name
                    : "Select a hostel"}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    hostelSelectOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {hostelSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {hostels && hostels.length > 0 ? (
                    hostels.map((hostel) => (
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
            {loading && (
              <p className="text-center text-lg text-gray-500">
                Loading menus...
              </p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Create Menu Form */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Create New Menu for {selectedHostel.hostel_name}
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="day"
                  className="block text-white text-lg font-medium mb-2"
                >
                  Day:
                </label>
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
                  <label className="block text-lg text-white font-medium mb-2">
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
                  </label>
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
                className={`w-full p-3 rounded-lg text-white ${
                  menuLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={menuLoading}
              >
                {menuLoading ? "Creating..." : "Create Menu"}
              </button>
            </div>

            {/* Menu List */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Current Menus for {selectedHostel.hostel_name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus && menus.length > 0 ? (
                  menus.map((menu) => (
                    <div
                      key={menu.day}
                      className="border p-6 rounded-lg shadow-lg"
                      style={{
                        background:
                          "linear-gradient(45deg,rgb(111, 143, 217),rgb(150, 93, 212),rgb(20, 161, 255))",
                        backgroundSize: "500% 500%",
                        animation: "gradient 5s ease infinite",
                      }}
                    >
                      <h3 className="text-xl font-bold mb-4 text-white">
                        {menu.day}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Meal Columns */}
                        {["breakfast", "lunch", "snacks", "dinner"].map(
                          (mealType) => (
                            <div
                              key={mealType}
                              className="border p-4 rounded-lg bg-white/60"
                            >
                              <h4 className="font-semibold">
                                {mealType.charAt(0).toUpperCase() +
                                  mealType.slice(1)}
                              </h4>
                              <p>{menu[mealType] || "Not Set"}</p>
                              <div className="mt-2">
                                <button
                                  onClick={() =>
                                    handleUpdateMeal(menu.day, mealType)
                                  }
                                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white col-span-3 text-center py-4">
                    No menus found for this hostel.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-white p-10 bg-black/40  backdrop-blur-lg rounded-xl border border-purple-500/50">
            <p className="text-xl">Please select a hostel to manage its menu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
