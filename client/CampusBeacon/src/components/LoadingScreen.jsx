import React from "react";
import {motion} from "framer-motion";

const LoadingScreen=()=>{
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="animate-twinkle absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + "px",
                height: Math.random() * 3 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 5 + "s",
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center relative z-10"
        >
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0">
              <div className="absolute inset-0 animate-ping bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75"></div>
            </div>
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
          >
            Loading CamousBeacon
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center gap-2 mt-4"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                style={{
                  animation: `bounce 1s infinite ${i * 0.2}s`,
                }}
              ></div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
}

export default LoadingScreen;