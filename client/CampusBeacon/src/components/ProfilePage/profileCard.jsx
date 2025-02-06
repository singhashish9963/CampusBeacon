import React from "react";
import { motion } from "framer-motion";

function Profile({ vals, header }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-6 relative group"
    >
      <p className="text-gray-400">{header}</p>
      <p className="text-white text-lg font-medium mt-1">{vals}</p>
    </motion.div>
  );
}

export default Profile;
