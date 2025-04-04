import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Edit, Plus, X } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteOfficial,
  getOfficialsByHostel,
  createOfficial,
  editOfficial,
} from "../../../slices/hostelSlice";

const Officials = ({ hostelId }) => {
  const { officials, loading, error } = useSelector((state) => state.hostel);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [deleteError, setDeleteError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
    official_id: null,
  });
  const [formErrors, setFormErrors] = useState({});

  // Updated permission check to use roles from auth state.
  const hasPermission = useMemo(() => {
    return (
      user &&
      (user.roles.includes("admin") || user.roles.includes("hostel_president"))
    );
  }, [user]);

  // Fetch officials on component mount
  useEffect(() => {
    if (hostelId) {
      dispatch(getOfficialsByHostel(hostelId));
    }
  }, [hostelId, dispatch]);

  // Memoize filtered officials for the current hostel
  const hostelOfficials = useMemo(() => {
    if (!Array.isArray(officials[hostelId])) return [];
    return officials[hostelId];
  }, [officials, hostelId]);

  const handleDeleteOfficial = async (officialId) => {
    if (!officialId || !hasPermission) return;

    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this official?")) {
      return;
    }

    try {
      setDeleteError("");
      await dispatch(deleteOfficial(officialId)).unwrap();
    } catch (error) {
      setDeleteError(
        error.message || "Error deleting official. Please try again."
      );
      console.error("Error deleting official:", error);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      designation: "",
      phone: "",
      email: "",
      official_id: null,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (official) => {
    setModalMode("edit");
    setFormData({
      name: official.name,
      designation: official.designation,
      phone: official.phone,
      email: official.email,
      official_id: official.official_id,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user changes input
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.designation.trim())
      errors.designation = "Designation is required";

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (modalMode === "create") {
        await dispatch(
          createOfficial({
            hostelId,
            name: formData.name,
            designation: formData.designation,
            phone: formData.phone,
            email: formData.email,
          })
        ).unwrap();
      } else {
        await dispatch(
          editOfficial({
            officialId: formData.official_id,
            name: formData.name,
            designation: formData.designation,
            phone: formData.phone,
            email: formData.email,
          })
        ).unwrap();
      }
      closeModal();
    } catch (error) {
      console.error("Error saving official:", error);
      setFormErrors((prev) => ({
        ...prev,
        form: error.message || "Error saving official. Please try again.",
      }));
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FaUsersGear className="mr-2" /> Hostel Officials
        </h2>
        {hasPermission && (
          <button
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center text-sm md:text-base"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Official
          </button>
        )}
      </div>

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
              className="p-4 rounded-lg border bg-black/30 flex flex-col md:flex-row justify-between"
            >
              <div className="w-full md:w-3/4">
                <h3 className="text-xl font-semibold text-white">
                  {official.name}
                </h3>
                <p className="text-gray-300">{official.designation}</p>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 sm:space-x-4 space-y-2 sm:space-y-0">
                  <a
                    href={`tel:${official.phone}`}
                    className="flex items-center text-gray-400 hover:text-white truncate max-w-xs"
                  >
                    <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{official.phone}</span>
                  </a>
                  <a
                    href={`mailto:${official.email}`}
                    className="flex items-center text-gray-400 hover:text-white truncate max-w-xs"
                  >
                    <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{official.email}</span>
                  </a>
                </div>
              </div>
              {hasPermission && (
                <div className="flex items-center space-x-2 mt-3 md:mt-0 justify-end">
                  <button
                    onClick={() => openEditModal(official)}
                    className="text-blue-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/10"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteOfficial(official.official_id)}
                    className="text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Modal for Create/Edit Official */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-purple-500/50 rounded-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {modalMode === "create" ? "Add New Official" : "Edit Official"}
            </h3>

            <form onSubmit={handleSubmit}>
              {formErrors.form && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{formErrors.form}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-black/40 text-white border ${
                      formErrors.name ? "border-red-500" : "border-gray-700"
                    } rounded-lg p-2.5 focus:outline-none focus:border-purple-500`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className={`w-full bg-black/40 text-white border ${
                      formErrors.designation
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded-lg p-2.5 focus:outline-none focus:border-purple-500`}
                  />
                  {formErrors.designation && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.designation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-black/40 text-white border ${
                      formErrors.phone ? "border-red-500" : "border-gray-700"
                    } rounded-lg p-2.5 focus:outline-none focus:border-purple-500`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-black/40 text-white border ${
                      formErrors.email ? "border-red-500" : "border-gray-700"
                    } rounded-lg p-2.5 focus:outline-none focus:border-purple-500`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                  >
                    {modalMode === "create" ? "Add Official" : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Officials;
