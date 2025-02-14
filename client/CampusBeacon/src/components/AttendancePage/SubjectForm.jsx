import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAttendance } from "../../contexts/attendanceContext";

const SubjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { addUserSubject, loading, error } = useAttendance();
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "", // Added for backend
    goal: initialData?.goal || 75,
    icon: initialData?.icon || "📚",
    totalClasses: initialData?.totalClasses || 0,
    attendedClasses: initialData?.attendedClasses || 0,
  });

  const icons = ["📚", "📐", "⚡", "💻", "🧪", "📝", "🎨", "🌍", "🔬", "📊"];

  // Clear form error after 3 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("Subject name is required");
      return false;
    }

    if (!formData.code.trim()) {
      setFormError("Subject code is required");
      return false;
    }

    if (formData.goal < 0 || formData.goal > 100) {
      setFormError("Goal must be between 0 and 100");
      return false;
    }

    if (parseInt(formData.attendedClasses) > parseInt(formData.totalClasses)) {
      setFormError("Attended classes cannot exceed total classes");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const formattedData = {
        ...formData,
        goal: parseInt(formData.goal) || 0,
        totalClasses: parseInt(formData.totalClasses) || 0,
        attendedClasses: parseInt(formData.attendedClasses) || 0,
      };

      // If editing existing subject
      if (initialData) {
        const response = await fetch(`/api/subjects/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error("Failed to update subject");
        }
      }
      // If adding new subject
      else {
        const response = await fetch("/api/v1/subjects/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error("Failed to add subject");
        }

        // Add subject to user's list after creation
        const data = await response.json();
        await addUserSubject(localStorage.getItem("userId"), data.data.id);
      }

      onSubmit(formattedData);
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-900/90 p-6 rounded-xl border border-purple-500/30 max-w-md w-full"
    >
      <h3 className="text-xl font-semibold text-white mb-4">
        {initialData ? "Edit Subject" : "Add New Subject"}
      </h3>

      {/* Error Display */}
      {(formError || error) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400"
        >
          {formError || error}
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Subject Name Input */}
        <div>
          <label className="block text-gray-400 mb-2">Subject Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter subject name"
            required
          />
        </div>

        {/* Subject Code Input */}
        <div>
          <label className="block text-gray-400 mb-2">Subject Code *</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter subject code"
            required
          />
        </div>

        {/* Total Classes Input */}
        <div>
          <label className="block text-gray-400 mb-2">Total Classes</label>
          <input
            type="number"
            min="0"
            value={formData.totalClasses}
            onChange={(e) =>
              setFormData({ ...formData, totalClasses: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Attended Classes Input */}
        <div>
          <label className="block text-gray-400 mb-2">Attended Classes</label>
          <input
            type="number"
            min="0"
            max={formData.totalClasses}
            value={formData.attendedClasses}
            onChange={(e) =>
              setFormData({ ...formData, attendedClasses: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Attendance Goal Input */}
        <div>
          <label className="block text-gray-400 mb-2">
            Attendance Goal (%) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-gray-400 mb-2">Icon</label>
          <div className="grid grid-cols-5 gap-2">
            {icons.map((icon) => (
              <motion.button
                key={icon}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, icon })}
                className={`p-2 rounded-lg text-xl ${
                  formData.icon === icon
                    ? "bg-purple-500 text-white"
                    : "bg-purple-500/10 hover:bg-purple-500/20 text-white"
                }`}
              >
                {icon}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
            disabled={loading}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg ${
              loading
                ? "bg-purple-500/50 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : initialData
              ? "Save Changes"
              : "Add Subject"}
          </motion.button>
        </div>

        {/* Required Fields Note */}
        <p className="text-gray-400 text-sm mt-4">* Required fields</p>
      </div>
    </motion.div>
  );
};

export default SubjectForm;
