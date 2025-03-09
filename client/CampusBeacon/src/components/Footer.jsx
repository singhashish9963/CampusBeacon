import React from "react";
import { motion } from "framer-motion";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiSocketdotio,
} from "react-icons/si";
import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";

import { BiLogoPostgresql } from "react-icons/bi";
import IconHoverStyle from "./IconHoverStyle";

const Footer = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white py-8 z-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* 
        ============================  
            Contact Us Section 
        =============================
          */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-4 font-mono">
            Contanct Us
          </h3>
          <div className="space-y-3">
            <a
              href="mailto:campusbeacon0@gmail.com"
              className="flex items-center hover:scale-105 hover:text-blue-400 transition-colors"
            >
              <HiMail className="mr-2" size={20} />
              <span>campusbeacon0@gmail.com</span>
            </a>
            <a
              href="tel:+919548999129"
              className="flex items-center hover:scale-105 hover:text-blue-400 transition-colors"
            >
              <HiPhone className="mr-2" size={20} />
              <span>+91 9548999129</span>
            </a>
            <a
              href="https://maps.app.goo.gl/tMuCf5DjfXLF3YuDA"
              className="flex items-center hover:scale-105 hover:text-blue-400 transition-colors"
            >
              <HiLocationMarker className="mr-2" size={20} />
              <span>Motilal Nehru National Institute of Technology</span>
            </a>
          </div>
        </motion.div>

        {/*
        ==========================
          Tech Stack Section 
        ===========================
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-4 font-mono">
            Build With
          </h3>
          <div className="flex flex-wrap gap-4">
            {/* To do: Add Hyperlinks to the icons */}

            <SiJavascript className={IconHoverStyle} size={24} />
            <SiNodedotjs className={IconHoverStyle} size={24} />
            <SiReact className={IconHoverStyle} size={24} />
            <BiLogoPostgresql className={IconHoverStyle} size={24} />
          </div>
        </motion.div>

        {/* 
        ===============================
            Social Links Section 
        ===============================
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 font-mono">
            Designed And Developed by
          </h3>
          <div className="space-y-4 mb-4">
            <div className="flex items-center">
              Ayush Jadaun
              <div className="flex space-x-4 pl-6">
                <a href="https://github.com/ayush-jadaun">
                  <FaGithub className={IconHoverStyle} size={24} />
                </a>
                <a href="https://www.linkedin.com/in/ayush-jadaun-677199311/">
                  <FaLinkedin className={IconHoverStyle} size={24} />
                </a>
                <a href="mailto:ayushjadaun6@gmail.com">
                  <FaEnvelope className={IconHoverStyle} size={24} />
                </a>
              </div>
            </div>
            <div className="flex items-center">
              Ayush Agarwal
              <div className="flex space-x-4 pl-4">
                <a href="https://github.com/ayushagr101">
                  <FaGithub className={IconHoverStyle} size={24} />
                </a>
                <a href="https://www.linkedin.com/in/ayush-agarwal-108127311/">
                  <FaLinkedin className={IconHoverStyle} size={24} />
                </a>
                <a href="mailto:ayush.agr160@gmail.com">
                  <FaEnvelope className={IconHoverStyle} size={24} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 
      =================================
            Copyright Section 
      =================================      
      */}

      <motion.div
        className="text-center mt-10 pt-4 border-t border-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.5 }}
      >
        <p className="text-sm tezt-gray-300">
          © {new Date().getFullYear()} CampusBeacon. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};
export default Footer;