import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../../../slices/hostelSlice";
import { toast } from "react-toastify";



const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "N/A";
  }
  
  return date.toLocaleString();
};

const Complaints = ({ hostelId }) => {
  const [selectedComplaintType, setSelectedComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [selectedOfficials, setSelectedOfficials] = useState([]);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  const dispatch = useDispatch();
  const {
    complaints,
    loading: hostelLoading,
    error: hostelError,
    officials: allHostelOfficials,
  } = useSelector((state) => state.hostel);
  const { user, roles } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && typeof user === "object") {
      setIsUserDataLoaded(true);
    }
  }, [user]);

  const userHasName = useMemo(() => {
    return !!user?.name?.trim();
  }, [user]);

  const hostelOfficials = useMemo(() => {
    return allHostelOfficials[hostelId] || [];
  }, [allHostelOfficials, hostelId]);

  const isAdmin = roles.includes("admin");
  const isHostelPresident = roles.includes("hostel_president");

  const filteredComplaints = useMemo(() => {
    const currentComplaints = complaints[hostelId];
    if (!Array.isArray(currentComplaints)) return [];

    return [...currentComplaints].sort((a, b) => {
      const statusOrder = { pending: 1, resolved: 2, rejected: 3 };
      const statusA = statusOrder[a.status] || 99;
      const statusB = statusOrder[b.status] || 99;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [complaints, hostelId]);

  // --- Complaint Types ---
  const complaintTypes = [
    "Maintenance Issue",
    "Food Complaint",
    "Cleanliness",
    "Infrastructure",
    "Other",
  ];

  // --- Validation ---
  const validateComplaint = () => {
    if (!userHasName) {
      toast.warn(
        "Please update your profile with your name before filing a complaint."
      );
      return false;
    }
    if (!selectedComplaintType) {
      toast.error("Please select a complaint type");
      return false;
    }
    if (!complaintDescription.trim()) {
      toast.error("Please provide a complaint description");
      return false;
    }
    if (complaintDescription.trim().length < 10) {
      toast.error("Complaint description must be at least 10 characters long");
      return false;
    }
    if (selectedOfficials.length === 0) {
      toast.error(
        "Please select at least one official to send the complaint to"
      );
      return false;
    }
    return true;
  };

  // --- Actions ---
  const submitComplaint = async () => {
    if (!validateComplaint() || isSubmitting) return;

    setIsSubmitting(true);
    const complaintData = {
      hostel_id: hostelId,
      complaint_type: selectedComplaintType,
      complaint_description: complaintDescription.trim(),
      student_name: user.name, // Use the validated user name
      student_email: user.email,
      official_ids: selectedOfficials,
      // Optional: Set a default due date (e.g., 7 days from now)
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      await dispatch(createComplaint(complaintData)).unwrap();
      toast.success("Complaint filed successfully!");
      // Reset form
      setSelectedComplaintType("");
      setComplaintDescription("");
      setSelectedOfficials([]);
    } catch (error) {
      console.error("Failed to file complaint:", error);
      toast.error(
        error?.message || "Failed to file complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (complaintId, status) => {
    if (!complaintId) return;

    const statusText = status === "resolved" ? "Resolved" : status; // For display
    const actionText = status === "resolved" ? "resolving" : "updating";

    const promise = dispatch(
      updateComplaintStatus({ complaintId, status })
    ).unwrap();

    toast.promise(
      promise,
      {
        pending: `Updating status to ${statusText}...`,
        success: `Complaint marked as ${statusText}.`,
        error: `Failed ${actionText} complaint.`,
      },
      { position: "bottom-right" }
    );

    try {
      await promise;
    } catch (error) {
      console.error(`Failed to ${actionText} complaint:`, error);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!complaintId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this complaint? This action cannot be undone."
      )
    ) {
      return;
    }

    const promise = dispatch(deleteComplaint(complaintId)).unwrap();

    toast.promise(
      promise,
      {
        pending: "Deleting complaint...",
        success: "Complaint deleted successfully.",
        error: "Failed to delete complaint.",
      },
      { position: "bottom-right" }
    );

    try {
      await promise;
    } catch (error) {
      console.error("Failed to delete complaint:", error);
      // Toast already handled
    }
  };

  const toggleOfficial = (officialId) => {
    setSelectedOfficials((prev) =>
      prev.includes(officialId)
        ? prev.filter((id) => id !== officialId)
        : [...prev, officialId]
    );
  };

  const canModifyComplaint = (complaint) => {
    // Admins or Hostel Presidents can modify any complaint in their hostel
    if (isAdmin || isHostelPresident) {
      return true;
    }
    // The user who filed the complaint can modify it (e.g., delete)
    return complaint.student_email === user.email;
  };

  // --- Render Logic ---

  // Handle initial loading or error fetching hostel data/complaints
  if ((hostelLoading && !complaints[hostelId]) || !isUserDataLoaded) {
    // Show loading only on initial fetch or when user data is not loaded
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

  if (hostelError) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-500/50"
      >
        <div className="flex items-center text-red-400">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>Error loading complaints: {hostelError}</p>
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
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Wrench className="mr-2" /> Complaints
      </h2>

      {/* Complaint Filing Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          File a Complaint
        </h3>

        {/* Warning if user has no name - only show when user data is fully loaded */}
        {isUserDataLoaded && !userHasName && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 flex items-center text-sm">
            <Info className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>
              Please update your profile with your name to file a complaint.
            </span>
            {/* Optional: Add a link to profile page */}
            {/* <a href="/profile" className="ml-2 underline hover:text-yellow-200">Update Profile</a> */}
          </div>
        )}

        <select
          value={selectedComplaintType}
          onChange={(e) => setSelectedComplaintType(e.target.value)}
          className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white border border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          required
          disabled={isSubmitting || !userHasName} // Disable if no name
        >
          <option value="">Select Complaint Type</option>
          {complaintTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <textarea
          value={complaintDescription}
          onChange={(e) => setComplaintDescription(e.target.value)}
          placeholder="Describe your complaint in detail (min. 10 characters)..."
          className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white h-32 resize-none border border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          required
          minLength={10}
          disabled={isSubmitting || !userHasName} // Disable if no name
        />
        <div className="mb-4">
          <button
            onClick={() => setShowOfficialDialog(true)}
            disabled={isSubmitting || !userHasName} // Disable if no name
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedOfficials.length > 0
              ? `Selected Officials: ${selectedOfficials.length}`
              : "Select Official(s) to Notify"}
          </button>
        </div>

        <button
          onClick={submitComplaint}
          disabled={isSubmitting || !userHasName} // Disable if submitting or no name
          className={`w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>

      {/* Officials Selection Dialog */}
      {showOfficialDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Added for smooth exit if using AnimatePresence
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          onClick={() => setShowOfficialDialog(false)} // Close on backdrop click
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 p-6 rounded-lg w-full max-w-md relative border border-purple-400/50 shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
          >
            <button
              onClick={() => setShowOfficialDialog(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
              aria-label="Close dialog"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              Select Official(s)
            </h3>
            {hostelOfficials.length === 0 ? (
              <p className="text-gray-400">
                No officials found for this hostel.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
                {hostelOfficials.map((official) => (
                  <label
                    key={official.official_id}
                    htmlFor={`official-${official.official_id}`}
                    className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`official-${official.official_id}`}
                      checked={selectedOfficials.includes(official.official_id)}
                      onChange={() => toggleOfficial(official.official_id)}
                      className="mr-3 h-4 w-4 rounded text-purple-500 focus:ring-purple-500 border-gray-600 bg-gray-700"
                    />
                    <span className="text-white">{official.name}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      {" "}
                      - {official.designation}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOfficialDialog(false)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Complaints List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4 border-t border-purple-500/30 pt-6 mt-8">
          <h3 className="text-lg font-semibold text-white">
            Complaint History
          </h3>
          {filteredComplaints.length > 0 && (
            <div className="text-sm text-gray-400">
              {filteredComplaints.filter((c) => c.status === "pending").length}{" "}
              Pending
            </div>
          )}
        </div>

        {filteredComplaints.length === 0 && !hostelLoading && (
          <div className="text-center py-8 text-gray-400">
            No complaints filed yet for this hostel.
          </div>
        )}

        {filteredComplaints.map((complaint) => (
          <motion.div
            key={complaint.complaint_id}
            layout // Animate layout changes (e.g., when status changes)
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} // Requires AnimatePresence around the mapping if needed
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border ${
              complaint.status === "pending"
                ? "bg-yellow-600/10 border-yellow-500/50"
                : complaint.status === "resolved"
                ? "bg-green-600/10 border-green-500/50"
                : "bg-red-600/10 border-red-500/50" // Assuming 'rejected' status is possible
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              {/* Complaint Details */}
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-white font-semibold">
                    {complaint.complaint_type}
                  </h4>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      complaint.status === "pending"
                        ? "bg-yellow-500/30 text-yellow-300"
                        : complaint.status === "resolved"
                        ? "bg-green-500/30 text-green-300"
                        : "bg-red-500/30 text-red-300" // Adjust for other statuses like 'rejected'
                    }`}
                  >
                    {complaint.status
                      ? complaint.status.charAt(0).toUpperCase() +
                        complaint.status.slice(1).toLowerCase()
                      : ""}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-2 break-words">
                  {complaint.complaint_description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400 items-center">
                  <p>
                    Filed by:{" "}
                    <span className="text-gray-200">
                      {complaint.student_name || "N/A"}
                    </span>
                  </p>
                  <p>
                    On:{" "}
                    <span className="text-gray-200">
                      {formatDate(complaint.createdAt)}
                    </span>
                  </p>
                  {complaint.due_date && (
                    <p>
                      Due:{" "}
                      <span className="text-gray-200">
                        {formatDate(complaint.due_date)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {canModifyComplaint(complaint) && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                  {/* Show Resolve button only if admin/president and status is pending */}
                  {(isAdmin || isHostelPresident) &&
                    complaint.status === "pending" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(complaint.complaint_id, "resolved")
                        }
                        className="flex items-center justify-center text-green-400 hover:text-green-300 transition-colors p-1.5 rounded-lg hover:bg-green-500/10 border border-green-500/30 hover:border-green-500/50"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="sr-only sm:not-sr-only sm:ml-1 text-xs">
                          Resolve
                        </span>
                      </button>
                    )}
                  {/* Allow deletion by filer, admin, or president */}
                  <button
                    onClick={() =>
                      handleDeleteComplaint(complaint.complaint_id)
                    }
                    className="flex items-center justify-center text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50"
                    title="Delete Complaint"
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="sr-only sm:not-sr-only sm:ml-1 text-xs">
                      Delete
                    </span>
                  </button>
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
