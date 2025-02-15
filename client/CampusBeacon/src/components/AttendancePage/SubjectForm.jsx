import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAttendance } from "../../contexts/attendanceContext";

// Define the API_URL visibly instead of using process.env
const API_URL = "http://localhost:5000/api/v1";

const SubjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { addUserSubject, loading, error } = useAttendance();
  const [formError, setFormError] = useState(null);

  // Added subjectId property
  const [formData, setFormData] = useState({
    subjectId: initialData?.id || "",
    name: initialData?.name || "",
    code: initialData?.code || "",
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
    // If not editing (i.e. adding new subject), subjectId is required.
    if (!initialData && !formData.subjectId.trim()) {
      setFormError("Subject ID is required");
      return false;
    }

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

      // Format numeric fields
      const formattedData = {
        ...formData,
        goal: parseInt(formData.goal) || 0,
        totalClasses: parseInt(formData.totalClasses) || 0,
        attendedClasses: parseInt(formData.attendedClasses) || 0,
      };

      // If editing an existing subject OR a subjectId is provided manually, update the subject
      if (initialData || formData.subjectId.trim()) {
        // Use formData.subjectId if provided, otherwise fallback to initialData.id
        const sid = formData.subjectId.trim() || initialData.id;
        const response = await fetch(`${API_URL}/subjects/${sid}`, {
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
      } else {
        // If adding a new subject
        const userId = localStorage.getItem("userId");
        const response = await fetch(`${API_URL}/subjects/user/${userId}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          // Pass subjectId along with other details in the request body
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error("Failed to add subject");
        }

        // After a successful add, update the user's subject list
        const data = await response.json();
        await addUserSubject(userId, data.data.subjectId || data.data.id);
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
        {/* Subject ID Input */}
        <div>
          <label className="block text-gray-400 mb-2">Subject ID</label>
          <input
            type="text"
            value={formData.subjectId}
            onChange={(e) =>
              setFormData({ ...formData, subjectId: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter subject ID"
          />
        </div>

        {/* Subject Name Input */}
        <div>
          <label className="block text-gray-400 mb-2">Subject Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, goal: e.target.value })
            }
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
                className={`p-2 border rounded-lg ${
                  formData.icon === icon
                    ? "bg-purple-500 text-white border-purple-600"
                    : "bg-purple-500/10 text-white border-purple-500/30"
                }`}
              >
                {icon}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
          disabled={loading}
        >
          {initialData ? "Update" : "Add Subject"}
        </button>
      </div>
    </motion.div>
  );
};

export default SubjectForm;
