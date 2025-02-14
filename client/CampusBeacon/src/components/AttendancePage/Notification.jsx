import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

const Notification = ({ type, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertTriangle className="w-5 h-5" />
      )}
      {message}
    </motion.div>
  );
};

export default Notification;
