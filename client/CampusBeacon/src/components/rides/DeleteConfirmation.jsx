import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DeleteConfirmation = ({ onConfirm, onCancel, rideName }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-gray-900 p-8 rounded-xl max-w-md w-full border-2 border-red-500/30"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Trash2 className="mr-3 text-red-400" /> Confirm Deletion
      </h3>
      <p className="text-gray-300 mb-6">
        Are you sure you want to delete this ride
        {rideName ? ` from ${rideName}` : ""}? This action cannot be undone.
      </p>
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
        >
          Delete
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DeleteConfirmation;
