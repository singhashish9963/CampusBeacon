import React from "react";
import { motion } from "framer-motion";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-[#0B1026] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Space station background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black" />
      </div>

      {/* Animated maintenance progress */}
      <div className="absolute top-0 left-0 w-full h-2">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 30, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Space Station Upgrades in Progress
            </span>
          </h1>

          <p className="text-blue-300 mb-8">
            Our stellar engineers are performing critical maintenance to enhance
            your cosmic experience. Expected completion time: 2 hours
          </p>

          {/* Maintenance progress indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "System Diagnostics", progress: 80 },
              { label: "Core Upgrades", progress: 45 },
              { label: "Safety Checks", progress: 20 },
            ].map((item, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-4">
                <p className="text-white mb-2">{item.label}</p>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="text-blue-300">
            <p>Stay updated on our progress:</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Status Page
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating tools animation */}
      <motion.div
        className="absolute left-10 bottom-10 w-24 h-24"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <img
          src="/tools.svg"
          alt="Maintenance tools"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

export default Maintenance;
