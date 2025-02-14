import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-12 h-12 text-purple-500" />
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
