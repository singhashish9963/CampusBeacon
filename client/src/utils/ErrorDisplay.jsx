import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
const ErrorDisplay = ({ error, onRetry, messagePrefix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-900/40 border border-red-700/50 text-red-300 p-3 rounded-lg mb-4 text-sm flex flex-col sm:flex-row items-center justify-between"
  >
    <div className="flex items-center mb-2 sm:mb-0">
      <FiAlertTriangle className="mr-2 text-lg flex-shrink-0" />
      <span>
        {messagePrefix}
        {error || "An unexpected error occurred."}
      </span>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
      >
        Retry
      </button>
    )}
  </motion.div>
);

export default ErrorDisplay;
