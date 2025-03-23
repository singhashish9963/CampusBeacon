import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X, ChevronDown } from "lucide-react";
import { useComplaints, useHostel } from "../../contexts/hostelContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const ComplaintPage = () => {
  const navigate = useNavigate();
  const { hostels, loading: hostelsLoading, fetchHostels } = useHostel();
  const {
    complaints,
    loading,
    error,
    fetchAllComplaints,
    createComplaint,
    editComplaint,
    deleteComplaint,
  } = useComplaints();
  const { user, loading: authLoading } = useAuth();
  const [hostelDetails, setHostelDetails] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [officials, setOfficials] = useState([]);
  const [complaintData, setComplaintData] = useState({
    student_name: user?.name || "",
    student_email: user?.email || "",
    official_id: "",
    official_name: "",
    official_email: "",
    complaint_type: "",
    complaint_description: "",
    due_date: "",
  });
  const [notification, setNotification] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [hostelSelectOpen, setHostelSelectOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);

  const complaintTypes = [
    "Water Supply Problems",
    "Electricity Issues",
    "WiFi & Internet Problems",
    "Cleanliness & Hygiene",
    "Pest Infestation",
    "Broken Infrastructure",
    "Poor Food Quality",
    "Insufficient Food Quantity",
    "Mess Timings",
    "Unhygienic Cooking Conditions",
    "Room Allocation Problems",
    "Overcrowding",
    "Roommate Conflicts",
    "Non-Functioning Fans/AC/Heaters",
    "Mattress & Bedding Issues",
    "Lack of Security Guards",
    "Unauthorized Visitors",
    "CCTV Not Working",
    "Theft & Lost Items",
    "Harassment or Bullying",
    "Unresponsive Warden/Admin",
    "Unfair Hostel Rules",
    "Late Fee Charges",
    "Laundry Issues",
    "Lack of Medical Assistance",
  ];

  // Effect to check authentication and fetch hostels
  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    // Using fetchHostels from the context
    fetchHostels();
  }, [user, authLoading, navigate, fetchHostels]);

  // Effect to fetch complaints when selected hostel changes
  useEffect(() => {
    if (selectedHostel) {
      fetchAllComplaints(selectedHostel.hostel_id);
      fetchHostelDetails(selectedHostel.hostel_id);
      fetchOfficials(selectedHostel.hostel_id);
    }
  }, [selectedHostel, fetchAllComplaints]);

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

  const fetchOfficials = async (hostel_id) => {
    try {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const response = await api.get(`/hostels/officials/hostel/${hostel_id}`);
      setOfficials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching officials:", error.response || error);
      setOfficials([]);
    }
  };

  const handleOfficialChange = (e) => {
    const selectedOfficial = officials.find(
      (off) => off.official_id === parseInt(e.target.value)
    );
    if (selectedOfficial) {
      setComplaintData((prev) => ({
        ...prev,
        official_id: selectedOfficial.official_id,
        official_name: selectedOfficial.name,
        official_email: selectedOfficial.email,
      }));
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateOrUpdateComplaint = async () => {
    if (!selectedHostel) {
      showNotification("Please select a hostel first", "error");
      return;
    }

    if (
      !complaintData.complaint_type ||
      !complaintData.complaint_description ||
      !complaintData.official_id
    ) {
      showNotification(
        "Please fill all required fields before submitting.",
        "error"
      );
      return;
    }

    setComplaintLoading(true);
    try {
      const complaintWithHostel = {
        ...complaintData,
        hostel_id: selectedHostel.hostel_id,
      };

      if (editMode) {
        await editComplaint(editMode, complaintWithHostel);
        showNotification("Complaint updated successfully!", "success");
      } else {
        await createComplaint(complaintWithHostel);
        showNotification("Complaint created successfully!", "success");
      }

      // Reset form
      setComplaintData({
        student_name: user?.name || "",
        student_email: user?.email || "",
        official_id: "",
        official_name: "",
        official_email: "",
        complaint_type: "",
        complaint_description: "",
        due_date: "",
      });
      setEditMode(null);
    } catch (err) {
      console.error("Error creating/updating complaint:", err);
      showNotification("Error saving complaint, please try again.", "error");
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleEdit = (complaint) => {
    setEditMode(complaint.complaint_id);
    setComplaintData({
      student_name: complaint.student_name,
      student_email: complaint.student_email,
      official_id: complaint.official_id,
      official_name: complaint.official_name,
      official_email: complaint.official_email,
      complaint_type: complaint.complaint_type,
      complaint_description: complaint.complaint_description,
      due_date: complaint.due_date ? complaint.due_date.split("T")[0] : "",
    });
  };

  const handleDelete = async (complaint_id) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      try {
        await deleteComplaint(complaint_id);
        showNotification("Complaint deleted successfully!", "success");
      } catch (error) {
        console.error(
          "Error deleting complaint:",
          error.response?.data || error
        );
        showNotification(
          "Error deleting complaint, please try again.",
          "error"
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prev) => ({
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
          Manage Complaints
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
                Loading complaints...
              </p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Create/Edit Complaint Form */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8 w-full">
              <h2 className="text-2xl text-white font-semibold mb-4">
                {editMode ? "Edit Complaint" : "Create New Complaint"} for{" "}
                {selectedHostel.hostel_name}
              </h2>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Assign To Official:
                </label>
                <select
                  name="official_id"
                  value={complaintData.official_id}
                  onChange={handleOfficialChange}
                  className="border bg-white p-3 w-full rounded-lg"
                >
                  <option value="">Select Official</option>
                  {officials.map((official) => (
                    <option
                      key={official.official_id}
                      value={official.official_id}
                    >
                      {official.name} - {official.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Complaint Type:
                </label>
                <select
                  name="complaint_type"
                  value={complaintData.complaint_type}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                >
                  <option value="">Select Complaint Type</option>
                  {complaintTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Description:
                </label>
                <textarea
                  name="complaint_description"
                  value={complaintData.complaint_description}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                  placeholder="Detailed complaint description"
                  rows="4"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-lg font-medium mb-2">
                  Due Date:
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={complaintData.due_date}
                  onChange={handleChange}
                  className="border bg-white p-3 w-full rounded-lg"
                />
              </div>

              <button
                onClick={handleCreateOrUpdateComplaint}
                className={`w-full p-3 rounded-lg text-white ${
                  complaintLoading
                    ? "bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={complaintLoading}
              >
                {complaintLoading
                  ? "Processing..."
                  : editMode
                  ? "Update Complaint"
                  : "Submit Complaint"}
              </button>
            </div>

            {/* Complaints List */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Current Complaints for {selectedHostel.hostel_name}
              </h2>
              {loading ? (
                <p className="text-white">Loading complaints...</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {complaints && complaints.length > 0 ? (
                    complaints.map((complaint) => (
                      <div
                        key={complaint.complaint_id}
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
                            {complaint.complaint_type}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-gray-700 font-medium">
                                Reported by:
                              </span>
                              <span>{complaint.student_name}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-700 font-medium">
                                Assigned to:
                              </span>
                              <span>{complaint.official_name}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-700 font-medium">
                                Due Date:
                              </span>
                              <span>
                                {complaint.due_date
                                  ? new Date(
                                      complaint.due_date
                                    ).toLocaleDateString()
                                  : "Not specified"}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-700 font-medium">
                              Description:
                            </span>
                            <p className="mt-1">
                              {complaint.complaint_description}
                            </p>
                          </div>
                          <div className="mt-4 flex space-x-4">
                            <button
                              onClick={() => handleEdit(complaint)}
                              className="text-blue-600 hover:text-blue-800 transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(complaint.complaint_id)
                              }
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
                      No complaints found for this hostel.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-white p-10 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50">
            <p className="text-xl">
              Please select a hostel to manage complaints
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintPage;
