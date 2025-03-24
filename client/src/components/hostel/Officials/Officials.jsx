import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { deleteOfficial } from "../../../slices/hostelSlice";

const Officials = ({ hostelId }) => {
  const { officials, loading, error } = useSelector((state) => state.hostel);
  const dispatch = useDispatch();
  const [deleteError, setDeleteError] = useState("");

  // Memoize filtered officials for the current hostel
  const hostelOfficials = useMemo(() => {
    if (!Array.isArray(officials[hostelId])) return [];
    return officials[hostelId];
  }, [officials, hostelId]);

  const handleDeleteOfficial = async (officialId) => {
    if (!officialId) return;

    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this official?")) {
      return;
    }

    try {
      setDeleteError("");
      await dispatch(deleteOfficial({ hostelId, officialId })).unwrap();
    } catch (error) {
      setDeleteError(
        error.message || "Error deleting official. Please try again."
      );
      console.error("Error deleting official:", error);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/50"
      >
        <p className="text-red-400">Error: {error}</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-purple-500/20 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border bg-black/30">
                <div className="h-6 bg-purple-500/20 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-purple-500/20 rounded w-1/2"></div>
                <div className="h-4 bg-purple-500/20 rounded w-1/3 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <FaUsersGear className="mr-2" /> Hostel Officials
      </h2>

      {deleteError && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400">{deleteError}</p>
        </div>
      )}

      <div className="space-y-4">
        {hostelOfficials.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No officials found</p>
        ) : (
          hostelOfficials.map((official) => (
            <motion.div
              key={official.official_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg border bg-black/30 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {official.name}
                </h3>
                <p className="text-gray-300">{official.designation}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <a
                    href={`tel:${official.phone}`}
                    className="flex items-center text-gray-400 hover:text-white"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {official.phone}
                  </a>
                  <a
                    href={`mailto:${official.email}`}
                    className="flex items-center text-gray-400 hover:text-white"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {official.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleDeleteOfficial(official.official_id)}
                className="text-red-500 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
              >
                Delete
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Officials;
