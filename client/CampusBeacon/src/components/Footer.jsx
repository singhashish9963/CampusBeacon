import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div className="bg-gradient-to-b from blue-900 to-black text-white py-7">
      <div className="container mx-auto grid grid-cols-1 md:grids-cols-3 gap-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-blue mb-4">Contanct Us</h3>
        </motion.div>
      </div>
    </div>
  );
};
export default Footer;
