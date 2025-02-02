import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

{/*Profile Card to display on Profile Page */}

function Profile({ vals, header }) {
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 rounded-xl p-6  relative group"
      >
        <motion.button
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          onClick={handleEdit}
          disabled={isLoading}
        >
          <Pencil className="w-5 h-5 text-purple-400" />
        </motion.button>
        <p className="text-gray-400">{header}</p>
        {isEditing ? (
          <input
            type="text"
            name="department"
            value={vals}
            onChange={handleChange}
            className="bg-transparent border-b border-purple-400 focus:outline-none text-white text-lg pt-1"
          />
        ) : (
          <p className="text-white text-lg font-medium mt-1">{vals}</p>
        )}
      </motion.div>
  );
}

export default Profile;
