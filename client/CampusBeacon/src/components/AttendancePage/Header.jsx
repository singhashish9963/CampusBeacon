import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAttendance } from "../../contexts/attendanceContext";

const Header = ({ currentUser }) => {
  const [currentDateTime, setCurrentDateTime] = useState("2025-02-13 14:39:18");
  const { error } = useAttendance();

  // Update current time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toISOString().replace("T", " ").split(".")[0];
      setCurrentDateTime(formatted);
    };

    // Update immediately
    updateDateTime();

    // Set up interval
    const timer = setInterval(updateDateTime, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  // Format time for display
  const formattedDateTime = new Date(currentDateTime).toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12 relative"
    >
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-0 right-0 bg-red-500/20 text-red-400 py-2 px-4 rounded-lg border border-red-500/30 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Main Title with Gradient Animation */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        Smart Attendance Tracker
      </motion.h1>

      {/* Subtitle with Typing Animation */}
      <motion.p
        className="text-gray-300 font-mono text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Track your academic journey with style
      </motion.p>

      {/* User Welcome Message */}
      <motion.p
        className="text-gray-300 font-mono text-sm mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Welcome, {currentUser}!
      </motion.p>

      {/* Current Time Display */}
      <motion.div
        className="text-gray-400 text-xs mt-2 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <span className="font-mono">{formattedDateTime}</span>
        <span className="bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30">
          UTC
        </span>
      </motion.div>

      {/* Session Info */}
      <motion.div
        className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <span>Session ID:</span>
        <span>•</span>
        <span>Version 1.0.0</span>
      </motion.div>
    </motion.div>
  );
};

export default Header;
