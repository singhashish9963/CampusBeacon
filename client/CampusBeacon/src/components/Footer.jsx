import React from "react";
import { motion } from "framer-motion";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
const Footer = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grids-cols-3 gap-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-blue-400 mb-4">Contanct Us</h3>
          <div className="space-y-3">
            <a
              href="mailto:campusbeacon0@gmail.com"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <HiMail className="mr-2" size={20} />
              <span>campusbeacon0@gmail.com</span>
            </a>
            <a
              href="tel:+919548999129"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <HiPhone className="mr-2" size={20} />
              <span>+91 9548999129</span>
            </a>
            <a
              href="https://maps.app.goo.gl/tMuCf5DjfXLF3YuDA"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <HiLocationMarker className="mr-2" size={20} />
              <span>Motilal Nehru National Institute of Technology</span>
            </a>
          </div>
        </motion.div>
        <motion.div></motion.div>
      </div>
    </div>
  );
};
export default Footer;
