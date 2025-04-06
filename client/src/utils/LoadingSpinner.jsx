import React from "react";
import { FiLoader } from "react-icons/fi";

const LoadingSpinner = ({ size = "text-4xl", color = "text-amber-400" }) => (
  <div className="flex justify-center items-center h-full py-4">
    <FiLoader className={`animate-spin ${color} ${size}`} />
  </div>
);

export default LoadingSpinner