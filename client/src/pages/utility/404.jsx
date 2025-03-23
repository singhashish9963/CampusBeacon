import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Added this import for React Router

const NotFound = () => {
  // Fixed syntax here (removed = sign)
  return (
    <div className="min-h-screen bg-[#0B1026] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl text-white mb-8">
            Houston, We Have a Problem!
          </h2>
          <p className="text-blue-300 mb-8 max-w-md mx-auto">
            The cosmic coordinates you're looking for seem to be in another
            galaxy. Let's navigate back to known space.
          </p>

          <Link to="/">
            {" "}
            {/* Changed href to to for React Router */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                         hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Return to Mission Control
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Floating astronaut */}
      <motion.div
        className="absolute right-10 bottom-10 w-32 h-32"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <img
          src="/astronaut.svg"
          alt="Lost astronaut"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

export default NotFound;
