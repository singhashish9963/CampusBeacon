import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";
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
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New states for official selection dialog
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [selectedOfficials, setSelectedOfficials] = useState([]); // array of official_id

  const dispatch = useDispatch();
  const { complaints, loading, error } = useSelector((state) => state.hostel);
  const { user, roles } = useSelector((state) => state.auth);
  // Get hostel officials from the hostel state; default to empty array if not loaded
  const hostelOfficials = useSelector(
    (state) => state.hostel.officials[hostelId] || []
  );

  const isAdmin = roles.includes("admin");
  const isHostelPresident = roles.includes("hostel_president");

  // Memoize filtered complaints for the current hostel
  const filteredComplaints = useMemo(() => {
    if (!Array.isArray(complaints[hostelId])) return [];
    return complaints[hostelId].sort((a, b) => {
      // Sort by status (pending first) and then by date
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [complaints, hostelId]);

  const complaintTypes = [
    "Maintenance Issue",
    "Food Complaint",
    "Cleanliness",
    "Infrastructure",
    "Other",
  ];

  const validateComplaint = () => {
    if (!selectedComplaintType) {
      setFormError("Please select a complaint type");
      return false;
    }

    if (!complaintDescription.trim()) {
      setFormError("Please provide a complaint description");
      return false;
    }

    if (complaintDescription.trim().length < 10) {
      setFormError(
        "Complaint description should be at least 10 characters long"
      );
      return false;
    }

    if (selectedOfficials.length === 0) {
      setFormError(
        "Please select at least one official to send the complaint to"
      );
      return false;
    }

    return true;
  };

  const submitComplaint = async () => {
    setFormError("");
    setActionError("");

    if (!validateComplaint()) return;

    try {
      setIsSubmitting(true);
      const complaintData = {
        hostel_id: hostelId,
        complaint_type: selectedComplaintType,
        complaint_description: complaintDescription.trim(),
        student_name: user.name,
        student_email: user.email,
        // Send the selected official IDs (could be an array if multiple selection is allowed)
        official_ids: selectedOfficials,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };
      await dispatch(createComplaint(complaintData)).unwrap();
      setSelectedComplaintType("");
      setComplaintDescription("");
      setSelectedOfficials([]);
      setFormError("");
    } catch (error) {
      setFormError(
        error.message || "Failed to file complaint. Please try again."
      );
      console.error("Failed to file complaint:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (complaintId, status) => {
    if (!complaintId) return;

    try {
      setActionError("");
      await dispatch(
        updateComplaintStatus({
          complaintId,
          status,
        })
      ).unwrap();
    } catch (error) {
      setActionError(
        `Failed to update complaint status: ${error.message || "Unknown error"}`
      );
      console.error("Failed to update complaint status:", error);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!complaintId) return;

    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      setActionError("");
      await dispatch(deleteComplaint(complaintId)).unwrap();
    } catch (error) {
      setActionError(
        `Failed to delete complaint: ${error.message || "Unknown error"}`
      );
      console.error("Failed to delete complaint:", error);
    }
  };

  // Allows a user to update selected officials from the dialog
  const toggleOfficial = (officialId) => {
    if (selectedOfficials.includes(officialId)) {
      setSelectedOfficials(selectedOfficials.filter((id) => id !== officialId));
    } else {
      setSelectedOfficials([...selectedOfficials, officialId]);
    }
  };

  // Only allow complaint editing/deletion if the current user created it OR if admin/hostel_president.
  const canModifyComplaint = (complaint) => {
    return (
      isAdmin || isHostelPresident || complaint.student_email === user.email
    );
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/50"
      >
        <div className="flex items-center text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Error: {error}</p>
        </div>
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

      {actionError && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{actionError}</p>
          </div>
        </div>
      )}

      {/* Complaint Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          File a Complaint
        </h3>
        <select
          value={selectedComplaintType}
          onChange={(e) => {
            setSelectedComplaintType(e.target.value);
            setFormError("");
          }}
          className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isSubmitting}
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
          onChange={(e) => {
            setComplaintDescription(e.target.value);
            setFormError("");
          }}
          placeholder="Describe your complaint in detail..."
          className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isSubmitting}
        />
        <div className="mb-4">
          <button
            onClick={() => setShowOfficialDialog(true)}
            disabled={isSubmitting}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            {selectedOfficials.length > 0
              ? `Selected Officials: ${selectedOfficials.join(", ")}`
              : "Select Official(s)"}
          </button>
        </div>
        {formError && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center text-red-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{formError}</p>
            </div>
          </div>
        )}
        <button
          onClick={submitComplaint}
          disabled={isSubmitting}
          className={`w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>

      {/* Officials Dialog for Complaint */}
      {showOfficialDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-6 rounded-lg w-full max-w-md relative"
          >
            <button
              onClick={() => setShowOfficialDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              Select Official(s)
            </h3>
            {hostelOfficials.length === 0 ? (
              <p className="text-gray-400">No officials available.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {hostelOfficials.map((official) => (
                  <div key={official.official_id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`official-${official.official_id}`}
                      checked={selectedOfficials.includes(official.official_id)}
                      onChange={() => toggleOfficial(official.official_id)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`official-${official.official_id}`}
                      className="text-white"
                    >
                      {official.name} - {official.designation}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowOfficialDialog(false)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            Recent Complaints
          </h3>
          {filteredComplaints.length > 0 && (
            <div className="text-sm text-gray-400">
              {filteredComplaints.filter((c) => c.status === "pending").length}{" "}
              pending
            </div>
          )}
        </div>
        {filteredComplaints.map((complaint) => (
          <motion.div
            key={complaint.complaint_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              complaint.status === "pending"
                ? "bg-yellow-500/10 border-yellow-500/50"
                : complaint.status === "resolved"
                ? "bg-green-500/10 border-green-500/50"
                : "bg-black/30"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">
                  {complaint.complaint_type}
                </h4>
                <p className="text-gray-300 mt-2">
                  {complaint.complaint_description}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                  <p>
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
                  <p>Filed by: {complaint.student_name}</p>
                  {complaint.due_date && (
                    <p>
                      Due: {new Date(complaint.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {canModifyComplaint(complaint) && (
                <div className="flex space-x-2">
                  {complaint.status === "pending" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(complaint.complaint_id, "resolved")
                      }
                      className="text-green-500 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-500/10"
                      title="Mark as Resolved"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleDeleteComplaint(complaint.complaint_id)
                    }
                    className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                    title="Delete Complaint"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {filteredComplaints.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No complaints filed yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Complaints;
