import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAttendanceContext } from "../../contexts/attendanceContext";

const StatsCard = ({ icon: Icon, title, value, colorClass, type }) => {
  const { loading } = useAttendanceContext();
  const [currentDateTime, setCurrentDateTime] = useState("2025-02-13 14:35:07");
  const [currentUser] = useState("ayush-jadaun");
  const [animatedValue, setAnimatedValue] = useState(0);

  // Update current date time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = now.toISOString().replace("T", " ").split(".")[0];
      setCurrentDateTime(formatted);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animate value changes when 'value' changes
  useEffect(() => {
    if (typeof value === "number") {
      const numeric = parseFloat(value);
      const duration = 1000; // animation duration in milliseconds
      const steps = 60;
      const increment = numeric / steps;
      let current = 0;

      const timer = setInterval(() => {
        if (current < numeric) {
          current += increment;
          setAnimatedValue(Math.min(current, numeric));
        } else {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  // Format the display value
  const getDisplayValue = () => {
    if (loading) return "Loading...";

    if (typeof value === "number") {
      return `${animatedValue.toFixed(1)}${type === "percentage" ? "%" : ""}`;
    }

    return value;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${colorClass} relative overflow-hidden`}
    >
      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex items-center gap-3">
        <Icon
          className={`${
            colorClass.includes("green")
              ? "text-green-400"
              : colorClass.includes("blue")
              ? "text-blue-400"
              : "text-purple-400"
          } w-8 h-8`}
        />
        <div className="flex-1">
          <h3
            className={`${
              colorClass.includes("green")
                ? "text-green-400"
                : colorClass.includes("blue")
                ? "text-blue-400"
                : "text-purple-400"
            } font-semibold`}
          >
            {title}
          </h3>
          <p className="text-white text-lg font-semibold">
            {getDisplayValue()}
          </p>
        </div>
      </div>

      {/* Time and User Info */}
      <div className="mt-3 pt-3 border-t border-white/10 text-xs">
        <div className="flex justify-between items-center text-gray-400">
          <span>UTC: {currentDateTime}</span>
          <span>User: {currentUser}</span>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/5 pointer-events-none"></div>
    </motion.div>
  );
};

export default StatsCard;
