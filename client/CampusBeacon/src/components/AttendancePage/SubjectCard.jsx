import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { Tilt } from "react-tilt";
import { useAttendance } from "../../contexts/attendanceContext";

const SubjectCard = ({ subject, stats, onEdit, onRemove, defaultOptions }) => {
  const { getAttendancePercentage, removeUserSubject } = useAttendance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAttendance, setCurrentAttendance] = useState(
    stats.attendancePercent
  );
  const [lastUpdated, setLastUpdated] = useState(null);

  // Format the current UTC time
  const currentTime = new Date().toISOString().replace("T", " ").split(".")[0];

  useEffect(() => {
    fetchAttendanceData();
  }, [subject.id]);

  const fetchAttendanceData = async () => {
    try {
      const percentage = await getAttendancePercentage(subject.id);
      setCurrentAttendance(percentage);
      setLastUpdated(currentTime);
    } catch (err) {
      setError("Failed to fetch attendance data");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      await removeUserSubject(userId, subject.id);
      onRemove(subject.id);
    } catch (err) {
      setError("Failed to remove subject");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tilt options={defaultOptions}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 p-6 relative"
      >
        {/* Error Display */}
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

        {/* Edit & Delete buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(subject)}
            className="p-2 rounded-lg hover:bg-purple-500/20"
            disabled={loading}
          >
            <Edit2 className="w-5 h-5 text-purple-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className={`p-2 rounded-lg hover:bg-red-500/20 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <h3 className="text-white font-semibold">{subject.name}</h3>
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
                {lastUpdated && (
                  <div className="text-xs text-gray-500">
                    Last updated: {lastUpdated}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              stats.status === "good"
                ? "bg-green-500/20 text-green-400"
                : stats.status === "warning"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {currentAttendance.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-purple-500/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentAttendance}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                stats.status === "good"
                  ? "bg-green-500"
                  : stats.status === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Goal: {subject.goal}%</span>
            <span className="text-gray-400">{stats.needed} needed</span>
          </div>
        </div>

        {/* Time Information */}
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <div className="text-xs text-gray-500 flex justify-between">
            <span>Current Time (UTC): {currentTime}</span>
            <span>User: ayush-jadaun</span>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default SubjectCard;
