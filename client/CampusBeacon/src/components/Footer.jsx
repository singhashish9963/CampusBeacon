import React from "react";
import { motion } from "framer-motion";
import {HiLocationMarker, HiMail, HiPhone} from "react-icons/hi";
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
          <div className="space-y-3">
            <a href="mailto:campusbeacon0@gmail.com"
            className="flex items-center hover:text-blue-400 transition-colors">
                <HiMail className="mr-2" size={20} />
                <span>campusbeacon0@gmail.com</span>
            </a>
            <a
            href="tel:+919548999129"
            className="flex items-center hover:text-blue-400 transition-colors">
            <HiPhone className="mr-2" size={20}/>
            <span>+91 9548999129</span>
            </a>
            <div className="flex items-center">
              <HiLocationMarker className="mr-2" size={20}/>
              <span>Motilal Nehru National Institute Of Technology, Prayagraj</span>
            </div>
          </div>
        </motion.div>
        <motion.div>
          

        </motion.div>
      </div>
    </div>
  );
};
export default Footer;
