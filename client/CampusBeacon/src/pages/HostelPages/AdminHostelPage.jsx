import { useEffect, useState } from "react";
import { useHostel } from "../../contexts/hostelContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookReader } from "react-icons/fa";
import {
  ChevronRight,
  Download,
  Link,
  Search,
  Book,
  FileText,
  Video,
  Calendar,
  Clock,
  Filter,
  Star,
} from "lucide-react";
import { MdOutlineBookmarks } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const AdminHostelPage = () => {
  const { hostels, loading, error, fetchHostels, createHostel, updateHostel, deleteHostel } = useHostel();
  const [newHostel, setNewHostel] = useState("");
  const [editHostel, setEditHostel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleCreate = async () => {
    if (!newHostel.trim()) {
      alert("Hostel name is required");
      return;
    }
  
    console.log("Creating hostel with:", { name: newHostel }); // Debug log
  
    try {
      await createHostel({ name: newHostel });
      setNewHostel("");
    } catch (err) {
      console.error("Error creating hostel:", err);
    }
  };
  
  
  const handleUpdate = async (id, name) => {
    if (!name.trim()) {
      alert("Hostel name cannot be empty");
      return;
    }
    await updateHostel(id, { name });
    setEditHostel(null);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            ></motion.div>
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl text-white font-bold mb-4">Manage Hostels</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4 bg-white flex gap-2">
        <input
          type="text"
          value={newHostel}
          onChange={(e) => setNewHostel(e.target.value)}
          placeholder="Enter hostel name"
          className="border p-2 flex-grow rounded"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {hostels.map((hostel) => (
            <li key={hostel.id} className="border p-4 flex justify-between items-center rounded">
              {editHostel === hostel.id ? (
                <input
                  type="text"
                  defaultValue={hostel.name}
                  onBlur={(e) => handleUpdate(hostel.id, e.target.value)}
                  className="border p-2 rounded"
                  autoFocus
                />
              ) : (
                <span className="cursor-pointer" onClick={() => navigate(`/hostels/${hostel.id}`)}>
                  {hostel.name}
                </span>
              )}
              <div className="flex gap-2">
                <button onClick={() => setEditHostel(hostel.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(hostel.id)} className="bg-purple-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
      </div>
    </div>
  );
};

export default AdminHostelPage;