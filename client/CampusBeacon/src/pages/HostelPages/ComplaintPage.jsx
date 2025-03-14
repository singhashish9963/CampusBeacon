import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useComplaints } from "../../contexts/hostelContext";

const ComplaintPage = () => {
  const navigate = useNavigate();
  const { hostel_id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const {
    complaints = [],
    loading,
    fetchAllComplaints,
    createComplaint,
    editComplaint,
    deleteComplaint,
  } = useComplaints();
  const [complaintData, setComplaintData] = useState({
    hostel_id: hostel_id || "",
    student_name: user?.name || "",
    student_email: user?.email || "",
    official_id: "",
    official_name: "",
    official_email: "",
    complaint_type: "",
    complaint_description: "",
    due_date: "",
  });
  const [editMode, setEditMode] = useState(null);
  const [officials, setOfficials] = useState([]);
  const [notification, setNotification] = useState(null);

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

  useEffect(() => {
    if (!user && !authLoading) navigate("/login");
    fetchAllComplaints(hostel_id);
  }, [user, authLoading, hostel_id, fetchAllComplaints]);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const response = await api.get(
          `/hostels/officials/hostel/${hostel_id}`
        );
        setOfficials(response.data.data);
      } catch (error) {
        console.error("Error fetching officials:", error);
        setOfficials([]);
      }
    };
    fetchOfficials();
  }, [hostel_id]);

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

  const handleChange = (e) => {
    setComplaintData({ ...complaintData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !complaintData.hostel_id ||
      !complaintData.complaint_type ||
      !complaintData.complaint_description
    ) {
      setNotification({
        message: "Please fill all fields before submitting.",
        type: "error",
      });
      return;
    }
    try {
      if (editMode) {
        await editComplaint(editMode, complaintData);
        setEditMode(null);
      } else {
        await createComplaint(complaintData);
      }
      setNotification({
        message: "Complaint submitted successfully!",
        type: "success",
      });
      setComplaintData({
        hostel_id: hostel_id || "",
        student_name: user?.name || "",
        student_email: user?.email || "",
        official_id: "",
        official_name: "",
        official_email: "",
        complaint_type: "",
        complaint_description: "",
        due_date: "",
      });
    } catch (error) {
      setNotification({ message: "Error submitting complaint", type: "error" });
    }
  };

  const handleDelete = async (complaint_id) => {
    if (!complaint_id) {
      console.error("Complaint ID is missing!");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete complaint ID: ${complaint_id}?`
      )
    )
      return;
    try {
      await deleteComplaint(complaint_id);
      setNotification({
        message: `Complaint ID: ${complaint_id} deleted successfully!`,
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Failed to delete complaint.",
        type: "error",
      });
    }
  };

  const handleUpdate = (complaint_id) => {
    const complaintToUpdate = complaints.find(
      (complaint) => complaint.complaint_id === complaint_id
    );
    if (complaintToUpdate) {
      setComplaintData({
        ...complaintToUpdate,
        official_id: complaintToUpdate.official_id,
        official_name: complaintToUpdate.official_name,
        official_email: complaintToUpdate.official_email,
      });
      setEditMode(complaint_id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8 flex justify-center items-center">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">
          Manage Complaints
        </h1>

        {notification && (
          <div
            className={`mb-6 p-4 text-white rounded-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Form for Creating/Editing Complaints */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8">
          <h2 className="text-2xl text-white font-semibold mb-4">
            {editMode ? "Edit Complaint" : "Create New Complaint"}
          </h2>
          <select
            name="official_id"
            value={complaintData.official_id}
            onChange={handleOfficialChange}
            className="border bg-white p-3 w-full rounded-lg mb-4"
          >
            <option value="">Select Official</option>
            {officials.map((official) => (
              <option key={official.official_id} value={official.official_id}>
                {official.name}
              </option>
            ))}
          </select>

          <select
            name="complaint_type"
            value={complaintData.complaint_type}
            onChange={handleChange}
            className="border bg-white p-3 w-full rounded-lg mb-4"
          >
            <option value="">Select Complaint Type</option>
            {complaintTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <textarea
            name="complaint_description"
            value={complaintData.complaint_description}
            onChange={handleChange}
            placeholder="Complaint Description"
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />

          <input
            type="date"
            name="due_date"
            value={
              complaintData.due_date ? complaintData.due_date.split("T")[0] : ""
            }
            onChange={handleChange}
            className="border bg-white p-3 w-full rounded-lg mb-4"
          />

          <button
            onClick={handleSubmit}
            className={`w-full p-3 rounded-lg text-white ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editMode
              ? "Update Complaint"
              : "Submit Complaint"}
          </button>
        </div>

        {/* Complaints List */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Complaints List
          </h2>
          {loading ? (
            <p className="text-white">Loading complaints...</p>
          ) : (
            <ul className="text-white">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <li
                    key={complaint.complaint_id}
                    className="border-b py-4 flex flex-col"
                  >
                    <span className="text-xl font-bold text-purple-400">
                      {complaint.complaint_type}
                    </span>
                    <span className="text-lg font-semibold">
                      {complaint.student_name} - {complaint.student_email}
                    </span>
                    <span className="text-sm">
                      {complaint.complaint_description}
                    </span>
                    <span className="text-sm">
                      Due Date:{" "}
                      {complaint.due_date
                        ? complaint.due_date.split("T")[0]
                        : ""}
                    </span>
                    <div className="space-x-2 mt-2">
                      <button
                        onClick={() => handleUpdate(complaint.complaint_id)}
                        className="text-yellow-400 hover:text-yellow-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(complaint.complaint_id)}
                        className="text-red-400 hover:text-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No complaints found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export default ComplaintPage;
