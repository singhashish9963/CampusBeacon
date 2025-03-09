import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, AlertCircle, X, Edit2, Trash2, Check, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHostel } from "../../contexts/hostelContext";
import { useAuth } from "../../contexts/AuthContext";

const AdminHostelPage = () => {
  const navigate = useNavigate();
  const { hostels, loading, fetchHostels, createHostel, updateHostel, deleteHostel } = useHostel();
  const { user, loading: authLoading, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [newHostel, setNewHostel] = useState("");
  const [editHostel, setEditHostel] = useState(null);
  const [editName, setEditName] = useState("");
  const [notification, setNotification] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    fetchHostels(); // ✅ Fetch hostels once authentication is checked
  }, [user, authLoading, fetchHostels]);

  if (authLoading) return <p>Checking authentication...</p>;
  if (!user) return null;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async () => {
    if (!newHostel.trim()) {
      showNotification("Hostel name is required", "error");
      return;
    }
    try {
      const createdHostel = await createHostel({ hostel_name: newHostel });
      setNewHostel("");
      showNotification("Hostel created successfully");
    } catch (err) {
      console.error("Error creating hostel:", err);
      showNotification("Error creating hostel", "error");
    }
  };

  const handleUpdate = async (hostel_id) => {
    if (!editName.trim()) {
      showNotification("Hostel name cannot be empty", "error");
      return;
    }
    try {
      await updateHostel(hostel_id, { hostel_name: editName });
      setEditHostel(null);
      setEditName(""); // Clear the edit name field after update
      showNotification("Hostel updated successfully");
    } catch (err) {
      console.error("Error updating hostel:", err);
      showNotification("Error updating hostel", "error");
    }
  };

  const handleDelete = async (hostel_id) => {
    try {
      await deleteHostel(hostel_id);
      showNotification("Hostel deleted successfully");
    } catch (err) {
      console.error("Error deleting hostel:", err);
      showNotification("Error deleting hostel", "error");
    }
  };

  const filteredHostels = hostels?.filter((hostel) =>
    hostel?.hostel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white p-8">
      {/* Notification */}
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

      <div className="container mx-auto max-w-4xl">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Manage Hostels
          </h2>
        </motion.div>

        {/* Search & Add */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hostels..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <input
            type="text"
            value={newHostel}
            onChange={(e) => setNewHostel(e.target.value)}
            placeholder="New Hostel Name"
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
          />
          <button onClick={handleCreate} className="bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Add Hostel
          </button>
        </div>

        {/* Hostel List */}
        {loading ? (
          <p className="text-center text-gray-400">Loading hostels...</p>
        ) : (
          <ul className="space-y-4">
            {filteredHostels.map((hostel) => (
              <li key={hostel.hostel_id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                {editHostel === hostel.hostel_id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(hostel.hostel_id)}
                    onBlur={() => handleUpdate(hostel.hostel_id)}
                    className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 focus:border-yellow-400"
                    autoFocus
                  />
                ) : (
                  <span className="cursor-pointer" onClick={() => navigate(`/hostels/${hostel.hostel_id}`)}>
                    {hostel.hostel_name}
                  </span>
                )}
                <div className="flex gap-2">
                  {editHostel === hostel.hostel_id ? (
                    <>
                      <button onClick={() => handleUpdate(hostel.hostel_id)} className="bg-green-500 px-3 py-1 rounded flex items-center gap-1">
                        <Check size={16} /> Save
                      </button>
                      <button onClick={() => setEditHostel(null)} className="bg-gray-500 px-3 py-1 rounded flex items-center gap-1">
                        <XCircle size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditHostel(hostel.hostel_id);
                          setEditName(hostel.hostel_name);
                        }}
                        className="bg-blue-500 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(hostel.hostel_id)} className="bg-red-500 px-3 py-1 rounded flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* User Info & Logout */}
        <div className="mt-6 flex justify-between items-center">
          <span>Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHostelPage;
