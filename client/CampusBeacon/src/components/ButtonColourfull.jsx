import React from "react";
import { motion } from "framer-motion";

const ButtonColourfull = ({ text = "Error", type = "submit" , textsize = "text-base", buttonsize = "w-full p-4"}) => {
  return (
    <motion.button
      text={text}
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`${buttonsize} text-m bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all ${textsize}`}
    >
      {text}
    </motion.button>
  );
};

export default ButtonColourfull;
