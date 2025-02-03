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
        </motion.div>
      </div>
    );
}