import React, { useState } from "react";
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
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.hostel);
  const { roles } = useSelector((state) => state.auth);

  const isAdmin = roles.includes("admin");
  const isHostelPresident = roles.includes("hostel_president");

  const complaintTypes = [
    "Maintenance Issue",
    "Food Complaint",
    "Cleanliness",
    "Infrastructure",
    "Other",
  ];

  const submitComplaint = async () => {
    if (selectedComplaintType && complaintDescription) {
      try {
        const complaintData = {
          hostel_id: hostelId,
          complaint_type: selectedComplaintType,
          complaint_description: complaintDescription,
        };
        await dispatch(createComplaint(complaintData)).unwrap();
        setSelectedComplaintType("");
        setComplaintDescription("");
      } catch (error) {
        console.error("Failed to file complaint:", error);
      }
    }
  };

  const handleStatusUpdate = async (complaintId, status) => {
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
    try {
      await dispatch(deleteComplaint(complaintId)).unwrap();
    } catch (error) {
      console.error("Failed to delete complaint:", error);
    }
  };

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
        />
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
        {complaints[hostelId]?.map((complaint) => (
          <motion.div
            key={complaint.id}
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
                        handleStatusUpdate(complaint.id, "resolved")
                      }
                      className="text-green-500 hover:text-green-600"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteComplaint(complaint.id)}
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
      </div>
    </motion.div>
  );
};

export default Complaints;
