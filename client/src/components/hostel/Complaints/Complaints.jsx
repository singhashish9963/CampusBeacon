import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wrench, CheckCircle, XCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../../../slices/hostelSlice";

const Complaints = ({ hostelId }) => {
  const [selectedComplaintType, setSelectedComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const { complaints, loading, error } = useSelector((state) => state.hostel);
  const { roles } = useSelector((state) => state.auth);

  const isAdmin = roles.includes("admin");
  const isHostelPresident = roles.includes("hostel_president");

  // Memoize filtered complaints for the current hostel
  const hostelComplaints = useMemo(() => {
    if (!Array.isArray(complaints[hostelId])) return [];
    return complaints[hostelId];
  }, [complaints, hostelId]);

  const complaintTypes = [
    "Maintenance Issue",
    "Food Complaint",
    "Cleanliness",
    "Infrastructure",
    "Other",
  ];

  const submitComplaint = async () => {
    setFormError("");

    if (!selectedComplaintType) {
      setFormError("Please select a complaint type");
      return;
    }

    if (!complaintDescription.trim()) {
      setFormError("Please provide a complaint description");
      return;
    }

    try {
      const complaintData = {
        hostel_id: hostelId,
        complaint_type: selectedComplaintType,
        complaint_description: complaintDescription.trim(),
      };
      await dispatch(createComplaint(complaintData)).unwrap();
      setSelectedComplaintType("");
      setComplaintDescription("");
      setFormError("");
    } catch (error) {
      setFormError(error.message || "Failed to file complaint");
      console.error("Failed to file complaint:", error);
    }
  };

  const handleStatusUpdate = async (complaintId, status) => {
    if (!complaintId) return;
    try {
      await dispatch(
        updateComplaintStatus({
          complaintId,
          status,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update complaint status:", error);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!complaintId) return;
    try {
      await dispatch(deleteComplaint(complaintId)).unwrap();
    } catch (error) {
      console.error("Failed to delete complaint:", error);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/50"
      >
        <p className="text-red-400">Error: {error}</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-purple-500/20 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-purple-500/20 rounded"></div>
            <div className="h-32 bg-purple-500/20 rounded"></div>
            <div className="h-10 bg-purple-500/20 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Wrench className="mr-2" /> Complaints
      </h2>

      {/* Complaint Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          File a Complaint
        </h3>
        <select
          value={selectedComplaintType}
          onChange={(e) => setSelectedComplaintType(e.target.value)}
          className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white"
          required
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
          placeholder="Describe your complaint..."
          className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white h-32 resize-none"
          required
        />
        {formError && <p className="text-red-400 mb-4">{formError}</p>}
        <button
          onClick={submitComplaint}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Submit Complaint
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Complaints
        </h3>
        {hostelComplaints.map((complaint) => (
          <motion.div
            key={complaint.complaint_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border bg-black/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">
                  {complaint.complaint_type}
                </h4>
                <p className="text-gray-300 mt-2">
                  {complaint.complaint_description}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Status:{" "}
                  <span
                    className={`${
                      complaint.status === "resolved"
                        ? "text-green-400"
                        : complaint.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </p>
              </div>
              {(isAdmin || isHostelPresident) && (
                <div className="flex space-x-2">
                  {complaint.status === "pending" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(complaint.complaint_id, "resolved")
                      }
                      className="text-green-500 hover:text-green-600"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleDeleteComplaint(complaint.complaint_id)
                      }
                      className="text-red-500 hover:text-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {hostelComplaints.length === 0 && (
          <p className="text-gray-400 text-center">No complaints filed yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default Complaints;
