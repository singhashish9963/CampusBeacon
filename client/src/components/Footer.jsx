import React from "react";
import { motion } from "framer-motion";
import { HiLocationMarker, HiMail, HiPhone, HiArrowUp } from "react-icons/hi";
import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiSocketdotio,
  SiTailwindcss,
  SiMongodb,
  SiRedux,
  SiTypescript,
  SiFramer,
  SiDocker,
  SiVercel,
  SiPrisma,
} from "react-icons/si";
import {
  FaLinkedin,
  FaEnvelope,
  FaGithub,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";

const technologies = [
  { Icon: SiJavascript, name: "JavaScript", color: "hover:text-yellow-400" },
  { Icon: SiReact, name: "React", color: "hover:text-cyan-400" },
  { Icon: SiNodedotjs, name: "Node.js", color: "hover:text-green-500" },
  { Icon: SiSocketdotio, name: "Socket.IO", color: "hover:text-white" },
  { Icon: BiLogoPostgresql, name: "PostgreSQL", color: "hover:text-blue-400" },
  { Icon: SiTailwindcss, name: "Tailwind CSS", color: "hover:text-teal-400" },
  { Icon: SiFramer, name: "Framer Motion", color: "hover:text-purple-400" },
  { Icon: SiVercel, name: "Vercel", color: "hover:text-gray-400" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Simple animation variants for lower overhead animations.
  const simpleFadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  };

  const simpleSlideIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white pt-16 pb-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Section */}
          <div>
            <motion.h3
              {...simpleSlideIn}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
            >
              About CampusBeacon
            </motion.h3>
            <p className="text-gray-400 mb-6">
              Your comprehensive campus companion, connecting students with
              resources, opportunities, and each other in one seamless platform.
            </p>
            <motion.div {...simpleFadeIn} className="flex space-x-4">
              <a
                href="https://twitter.com/campusbeacon"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com/campusbeacon"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://github.com/campusbeacon"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </a>
            </motion.div>
          </div>

          {/* Contact Section */}
          <div>
            <motion.h3
              {...simpleSlideIn}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
            >
              Contact Us
            </motion.h3>
            <div className="space-y-4">
              <motion.a
                {...simpleSlideIn}
                href="mailto:campusbeacon0@gmail.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <HiMail className="text-xl" />
                <span>campusbeacon0@gmail.com</span>
              </motion.a>
              <motion.a
                {...simpleSlideIn}
                href="tel:+919548999129"
                className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <HiPhone className="text-xl" />
                <span>+91 9548999129</span>
              </motion.a>
              <motion.a
                {...simpleSlideIn}
                href="https://maps.app.goo.gl/tMuCf5DjfXLF3YuDA"
                className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <HiLocationMarker className="text-xl" />
                <span>MNNIT Allahabad</span>
              </motion.a>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div>
            <motion.h3
              {...simpleSlideIn}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
            >
              Built With
            </motion.h3>
            <div className="grid grid-cols-4 gap-4">
              {technologies.map(({ Icon, name, color }) => (
                <motion.div
                  key={name}
                  {...simpleFadeIn}
                  className={`text-gray-400 ${color} transition-colors cursor-pointer`}
                  title={name}
                >
                  <Icon size={24} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <motion.h3
              {...simpleSlideIn}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
            >
              Our Team
            </motion.h3>
            <div className="space-y-6">
              <motion.div {...simpleSlideIn} className="group">
                <h4 className="text-lg font-semibold text-white mb-1">
                  Ayush Jadaun
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  Full Stack Developer
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/ayush-jadaun"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayush-jadaun-677199311/"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href="mailto:ayushjadaun6@gmail.com"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FaEnvelope size={18} />
                  </a>
                </div>
              </motion.div>
              <motion.div {...simpleSlideIn} className="group">
                <h4 className="text-lg font-semibold text-white mb-1">
                  Ayush Agarwal
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  Full Stack Developer
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/ayushagr101"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayush-agarwal-108127311/"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href="mailto:ayush.agr160@gmail.com"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FaEnvelope size={18} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col justify-between items-center">
            <motion.p
              {...simpleFadeIn}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {new Date().getFullYear()} CampusBeacon. All rights reserved.
            </motion.p>
            <div className="flex space-x-6 pt-10">
              <a
                href="/policy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/about"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
        {...simpleFadeIn}
      >
        <HiArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;
