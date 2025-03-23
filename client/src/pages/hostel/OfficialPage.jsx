import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X, ChevronDown } from "lucide-react";
import { useOfficial, useHostel } from "../../contexts/hostelContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const OfficialPage = () => {
  const navigate = useNavigate();
  const { hostels, loading: hostelsLoading, fetchHostels } = useHostel();
  const {
    officials,
    loading,
    error,
    fetchOfficialsByHostel,
    createOfficial,
    editOfficial,
    deleteOfficial,
  } = useOfficial();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [hostelDetails, setHostelDetails] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [newOfficial, setNewOfficial] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
  });
  const [notification, setNotification] = useState(null);
  const [officialLoading, setOfficialLoading] = useState(false);
  const [hostelSelectOpen, setHostelSelectOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);

  // Effect to check authentication and fetch hostels
  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    // Using fetchHostels from the context
    fetchHostels();
  }, [user, authLoading, navigate, fetchHostels]);

  // Effect to fetch officials when selected hostel changes
  useEffect(() => {
    if (selectedHostel) {
      fetchOfficialsByHostel(selectedHostel.hostel_id);
      fetchHostelDetails(selectedHostel.hostel_id);
    }
  }, [selectedHostel, fetchOfficialsByHostel]);

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

  const handleCreateOrUpdateOfficial = async () => {
    if (!selectedHostel) {
      showNotification("Please select a hostel first", "error");
      return;
    }

    if (
      !newOfficial.name ||
      !newOfficial.email ||
      !newOfficial.phone ||
      !newOfficial.designation
    ) {
      showNotification("Please fill all fields before submitting.", "error");
      return;
    }

    setOfficialLoading(true);
    try {
      if (editMode) {
        await editOfficial(editMode, {
          hostel_id: selectedHostel.hostel_id,
          ...newOfficial,
        });
        showNotification("Official updated successfully!", "success");
      } else {
        await createOfficial({
          hostel_id: selectedHostel.hostel_id,
          ...newOfficial,
        });
        showNotification("Official created successfully!", "success");
      }

      setNewOfficial({
        name: "",
        email: "",
        phone: "",
        designation: "",
      });
      setEditMode(null);
    } catch (err) {
      console.error("Error creating/updating official:", err);
      showNotification("Error saving official, please try again.", "error");
    } finally {
      setOfficialLoading(false);
    }
  };

  const handleEdit = (official) => {
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
        console.error(
          "Error deleting official:",
          error.response?.data || error
        );
        showNotification("Error deleting official, please try again.", "error");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOfficial((prev) => ({
      ...prev,
      [name]: value,
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
          Manage Hostel Officials
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
                Loading officials...
              </p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Create/Edit Official Form */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
              <h2 className="text-2xl text-white font-semibold mb-4">
                {editMode ? "Edit Official" : "Create New Official"} for{" "}
                {selectedHostel.hostel_name}
              </h2>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Designation:
                </label>
                <input
                  type="text"
                  name="designation"
                  value={newOfficial.designation}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                  placeholder="Enter Designation"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newOfficial.name}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                  placeholder="Enter Name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={newOfficial.email}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                  placeholder="Enter Email (Unique)"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newOfficial.phone}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                  placeholder="Enter Phone (10-12 characters)"
                />
              </div>

              <button
                onClick={handleCreateOrUpdateOfficial}
                className={`w-full p-3 rounded-lg text-white ${
                  officialLoading
                    ? "bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={officialLoading}
              >
                {officialLoading
                  ? "Processing..."
                  : editMode
                  ? "Update Official"
                  : "Create Official"}
              </button>
            </div>

            {/* Officials List */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Current Officials for {selectedHostel.hostel_name}
              </h2>
              {loading ? (
                <p className="text-white">Loading officials...</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {officials && officials.length > 0 ? (
                    officials.map((official) => (
                      <div
                        key={official.official_id}
                        className="border rounded-lg p-4 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(45deg,rgb(111, 143, 217),rgb(150, 93, 212),rgb(20, 161, 255))",
                          backgroundSize: "500% 500%",
                          animation: "gradient 5s ease infinite",
                        }}
                      >
                        <div className="bg-white/60 p-4 rounded-lg">
                          <h3 className="text-xl font-bold mb-2">
                            {official.designation}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-gray-700 font-medium">
                                Name:
                              </span>
                              <span>{official.name}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-700 font-medium">
                                Email:
                              </span>
                              <span>{official.email}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-700 font-medium">
                                Phone:
                              </span>
                              <span>{official.phone}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-4">
                            <button
                              onClick={() => handleEdit(official)}
                              className="text-blue-600 hover:text-blue-800 transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(official.official_id)}
                              className="text-red-600 hover:text-red-800 transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white text-center py-4">
                      No officials found for this hostel.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-white p-10 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50">
            <p className="text-xl">
              Please select a hostel to manage its officials
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialPage;
