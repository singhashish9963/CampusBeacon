import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAttendanceContext } from "../../contexts/attendanceContext";

const SubjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const {
    addUserSubject,
    fetchSubjects,
    subjects,
    loading,
    error,
    currentDateTime,
    currentUser,
    refreshUserSubjects,
  } = useAttendanceContext();

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subjectId: initialData?.id || "",
    name: initialData?.name || "",
    code: initialData?.code || "",
    goal: initialData?.goal || 75,
    icon: initialData?.icon || "📚",
    totalClasses: initialData?.totalClasses || 0,
    attendedClasses: initialData?.attendedClasses || 0,
    lastModified: currentDateTime,
    modifiedBy: currentUser?.login || "unknown",
  });

  const icons = ["📚", "📐", "⚡", "💻", "🧪", "📝", "🎨", "🌍", "🔬", "📊"];

  // Load available subjects on mount so that the dropdown lists only those subjects available (if needed)
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        await fetchSubjects();
      } catch (err) {
        setFormError("Failed to load subjects list");
      }
    };
    loadSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const validateForm = () => {
    if (!initialData && !formData.subjectId) {
      setFormError(
        "Please select a subject from the dropdown or enter a subject ID"
      );
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
      setFormError("Attendance goal must be between 0 and 100%");
      return false;
    }

    if (parseInt(formData.attendedClasses) > parseInt(formData.totalClasses)) {
      setFormError("Attended classes cannot exceed total classes");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        goal: parseInt(formData.goal) || 75,
        totalClasses: parseInt(formData.totalClasses) || 0,
        attendedClasses: parseInt(formData.attendedClasses) || 0,
        lastModified: currentDateTime,
        modifiedBy: currentUser?.login,
      };

      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      if (initialData) {
        await refreshUserSubjects(currentUser.id);
        onSubmit(formattedData);
      } else {
        // Use the updated context function that only requires subjectId
        const result = await addUserSubject(formData.subjectId);
        if (result) {
          await refreshUserSubjects(currentUser.id);
          onSubmit(formattedData);
        } else {
          throw new Error("Failed to add subject");
        }
      }
    } catch (err) {
      setFormError(err.message || "Failed to save subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubjectSelect = (e) => {
    const selectedId = e.target.value;
    const selectedSubject = subjects.find((subj) => subj.id === +selectedId);

    if (selectedSubject) {
      setFormData({
        ...formData,
        subjectId: selectedId,
        name: selectedSubject.name,
        code: selectedSubject.code,
        icon: selectedSubject.icon || "📚",
        lastModified: currentDateTime,
        modifiedBy: currentUser?.login,
      });
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
        {!initialData && (
          <div>
            <label className="block text-gray-400 mb-2">
              Choose from existing subjects
            </label>
            <select
              onChange={handleSubjectSelect}
              className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading || isSubmitting}
              value={formData.subjectId}
            >
              <option value="">-- Select a Subject --</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
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
              readOnly={!!initialData}
              disabled={loading || isSubmitting}
            />
          </div>

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
              disabled={loading || isSubmitting}
            />
          </div>

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
              disabled={loading || isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                disabled={loading || isSubmitting}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">
                Attended Classes
              </label>
              <input
                type="number"
                min="0"
                max={formData.totalClasses}
                value={formData.attendedClasses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attendedClasses: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading || isSubmitting}
              />
            </div>
          </div>

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
              disabled={loading || isSubmitting}
            />
          </div>

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
                  disabled={loading || isSubmitting}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <div className="text-xs text-gray-500 flex justify-between">
          <span>Last Modified: {formData.lastModified}</span>
          <span>By: {formData.modifiedBy}</span>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
          disabled={isSubmitting || loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Add Subject"}
        </button>
      </div>
    </motion.div>
  );
};

export default SubjectForm;
