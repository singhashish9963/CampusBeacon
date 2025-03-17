import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Edit2, Trash2, AlertTriangle, Award } from "lucide-react";
import { Tilt } from "react-tilt";
import { useAttendanceContext } from "../../contexts/attendanceContext";

const SubjectCard = ({ subject, stats, onEdit, onRemove, defaultOptions }) => {
  const {
    removeUserSubject,
    currentDateTime,
    currentUser,
    loading: contextLoading,
    refreshUserSubjects,
  } = useAttendanceContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine attendance status based on percentage and goal
  const getAttendanceStatus = () => {
    const percent = stats.attendancePercent;
    if (percent >= subject.goal) return "good";
    if (percent >= subject.goal * 0.75) return "warning";
    return "danger";
  };

  const formatNumber = (num) => Number(num).toFixed(1);

  const handleRemove = async () => {
    if (!currentUser?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      // removeUserSubject now only requires subject.id as parameter
      const success = await removeUserSubject(subject.id);
      if (success) {
        await refreshUserSubjects(currentUser.id);
        onRemove(subject.id);
      } else {
        throw new Error("Failed to remove subject");
      }
    } catch (err) {
      setError(err.message || "Failed to remove subject");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || contextLoading;

  return (
    <Tilt options={{ ...defaultOptions, max: 10 }}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 p-6 relative"
      >
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 left-0 right-0 p-2 bg-red-500/20 text-red-400 text-sm rounded-t-xl flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit & Delete buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(subject)}
            className="p-2 rounded-lg hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
            title="Edit subject"
          >
            <Edit2 className="w-5 h-5 text-purple-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className="p-2 rounded-lg hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
            title="Remove subject"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </motion.button>
        </div>

        {/* Subject Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                {subject.name}
                {getAttendanceStatus() === "good" && (
                  <Award className="w-4 h-4 text-green-400" />
                )}
              </h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {subject.attendedClasses}/{subject.totalClasses} classes
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Code: {subject.code}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              getAttendanceStatus() === "good"
                ? "bg-green-500/20 text-green-400"
                : getAttendanceStatus() === "warning"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {formatNumber(stats.attendancePercent)}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-purple-500/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.attendancePercent, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                getAttendanceStatus() === "good"
                  ? "bg-green-500"
                  : getAttendanceStatus() === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Goal: {subject.goal}%</span>
            <span className="text-gray-400">
              {stats.needed > 0
                ? `${stats.needed} classes needed`
                : "Goal reached!"}
            </span>
          </div>
        </div>

        {/* Time and User Information */}
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <div className="text-xs text-gray-500 flex justify-between">
            <span>Last Updated: {currentDateTime}</span>
            <span>User: {currentUser?.login || "Unknown"}</span>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default SubjectCard;
