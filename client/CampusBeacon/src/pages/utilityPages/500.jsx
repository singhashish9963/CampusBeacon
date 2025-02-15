import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Changed from next/link to react-router-dom

const ServerError = () => {
  return (
    <div className="min-h-screen bg-[#0B1026] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated nebula effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-transparent to-blue-800 animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            500
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl text-white mb-8">
            Space Station Malfunction
          </h2>
          <p className="text-blue-300 mb-8 max-w-md mx-auto">
            Our systems encountered an unexpected anomaly. Our space engineers
            are working to resolve the issue.
          </p>

          <div className="space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium
                         hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              Restart Mission
            </motion.button>

            <Link to="/">
              {" "}
              {/* Changed href to to for React Router */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium
                           hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Return to Base
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Animated warning lights */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full"
          style={{
            top: `${20 + i * 30}%`,
            right: "10%",
            backgroundColor: "#ff4444",
          }}
          animate={{
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default ServerError;
