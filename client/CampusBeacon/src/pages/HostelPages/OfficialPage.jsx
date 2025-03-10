import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useOfficial } from "../../contexts/hostelContext";

const OfficialPage = () => {
    const navigate = useNavigate();
    const { hostel_id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const {
        officials,
        fetchOfficialsByHostel,
        fetchOfficialById,
        createOfficial,
        editOfficial,
        deleteOfficial,
        loading: officialLoading,
    } = useOfficial();

    const [hostelDetails, setHostelDetails] = useState(null);
    const [notification, setNotification] = useState(null);
    const [selectedOfficial, setSelectedOfficial] = useState(null);
    const [newOfficial, setNewOfficial] = useState({
        name: "",
        email: "",
        phone: "",
        designation: "",
    });
    const [editMode, setEditMode] = useState(null);

    useEffect(() => {
        if (!user && !authLoading) navigate("/login");
        fetchOfficialsByHostel(hostel_id);
    }, [user, authLoading, hostel_id, fetchOfficialsByHostel]);

    useEffect(() => {
        const fetchHostelDetails = async () => {
            try {
                const api = axios.create({
                    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                });
                const response = await api.get(`/hostels/hostels/${hostel_id}`);
                setHostelDetails(response.data);
            } catch (error) {
                console.error(
                    "Error fetching hostel details:",
                    error.response || error
                );
            }
        };
        fetchHostelDetails();
    }, [hostel_id]);

    useEffect(() => {
        if (editMode) {
            fetchOfficialById(editMode)
                .then((data) => setSelectedOfficial(data))
                .catch((error) => console.error("Error fetching official:", error));
        }
    }, [editMode, fetchOfficialById]);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCreateOrUpdateOfficial = async () => {
        if (
            !newOfficial.name ||
            !newOfficial.email ||
            !newOfficial.phone ||
            !newOfficial.designation
        ) {
            showNotification("Please fill all fields before submitting.", "error");
            return;
        }

        if (!hostel_id) {
            showNotification("Hostel ID is missing. Please try again.", "error");
            return;
        }

        try {
            if (editMode) {
                await editOfficial(editMode, { hostel_id, ...newOfficial });
                showNotification("Official updated successfully!", "success");
            } else {
                await createOfficial({ hostel_id, ...newOfficial });
                showNotification("Official created successfully!", "success");
            }

            setNewOfficial({ name: "", email: "", phone: "", designation: "" });
            setEditMode(null);
            setSelectedOfficial(null);
        } catch (error) {
            console.error("Error saving official:", error);
            showNotification(
                error.response?.data?.message ||
                    "Error saving official, please try again.",
                "error"
            );
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

    if (authLoading) return <p>Checking authentication...</p>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8 flex justify-center items-center">
            <div className="w-full max-w-4xl p-6">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center mb-6">
                    Manage Hostel Officials
                </h1>

                {/* Form for Creating/Editing Officials */}
                <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 mb-8">
                    <h2 className="text-2xl text-white font-semibold mb-4">
                        {editMode ? "Edit Official" : "Create New Official"}
                    </h2>
                    <input
                        type="text"
                        name="designation"
                        value={newOfficial.designation}
                        onChange={(e) =>
                            setNewOfficial({ ...newOfficial, designation: e.target.value })
                        }
                        placeholder="Enter Designation"
                        className="border bg-white p-3 w-full rounded-lg mb-4"
                    />
                    <input
                        type="text"
                        name="name"
                        value={newOfficial.name}
                        onChange={(e) =>
                            setNewOfficial({ ...newOfficial, name: e.target.value })
                        }
                        placeholder="Enter Name"
                        className="border bg-white p-3 w-full rounded-lg mb-4"
                    />
                    <input
                        type="email"
                        name="email"
                        value={newOfficial.email}
                        onChange={(e) =>
                            setNewOfficial({ ...newOfficial, email: e.target.value })
                        }
                        placeholder="Enter Email (Unique)"
                        className="border bg-white p-3 w-full rounded-lg mb-4"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={newOfficial.phone}
                        onChange={(e) =>
                            setNewOfficial({ ...newOfficial, phone: e.target.value })
                        }
                        placeholder="Enter Phone (10-12 characters)"
                        className="border bg-white p-3 w-full rounded-lg mb-4"
                    />
                    <button
                        onClick={handleCreateOrUpdateOfficial}
                        className={`w-full p-3 rounded-lg text-white ${
                            officialLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
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
                        Officials List
                    </h2>
                    {officialLoading ? (
                        <p className="text-white">Loading officials...</p>
                    ) : (
                        <ul className="text-white">
                            {officials.length > 0 ? (
                                officials.map((official) => (
                                    <li
                                        key={official.official_id}
                                        className="border-b py-4 flex flex-col"
                                    >
                                        <span className="text-xl font-bold text-purple-400">
                                            {official.designation}
                                        </span>
                                        <span className="text-lg font-semibold">
                                            {official.name}
                                        </span>
                                        <span className="text-sm">Email: {official.email}</span>
                                        <span className="text-sm">Phone: {official.phone}</span>
                                        <div className="space-x-2 mt-2">
                                            <button
                                                onClick={() => handleEdit(official)}
                                                className="text-yellow-400"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(official.official_id)}
                                                className="text-red-400"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p>No officials found.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfficialPage;