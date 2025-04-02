import React from "react";
import { motion } from "framer-motion";
import { HiLocationMarker, HiMail, HiPhone, HiArrowUp } from "react-icons/hi";
import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiTailwindcss,
  SiFramer,
  SiVercel,
  SiPrisma,
  SiSupabase, // Added Supabase
} from "react-icons/si";
import {
  FaLinkedin,
  FaEnvelope,
  FaGithub,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";

// Updated technologies array with URLs and Supabase, removed Socket.IO
const technologies = [
  {
    Icon: SiJavascript,
    name: "JavaScript",
    color: "hover:text-yellow-400",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    Icon: SiReact,
    name: "React",
    color: "hover:text-cyan-400",
    url: "https://react.dev/",
  },
  {
    Icon: SiNodedotjs,
    name: "Node.js",
    color: "hover:text-green-500",
    url: "https://nodejs.org/",
  },
  {
    Icon: BiLogoPostgresql,
    name: "PostgreSQL",
    color: "hover:text-blue-400",
    url: "https://www.postgresql.org/",
  },
  {
    Icon: SiTailwindcss,
    name: "Tailwind CSS",
    color: "hover:text-teal-400",
    url: "https://tailwindcss.com/",
  },
  {
    Icon: SiFramer,
    name: "Framer Motion",
    color: "hover:text-purple-400",
    url: "https://www.framer.com/motion/",
  },
  {
    Icon: SiVercel,
    name: "Vercel",
    color: "hover:text-gray-400",
    url: "https://vercel.com/",
  },
  {
    Icon: SiSupabase,
    name: "Supabase",
    color: "hover:text-green-400",
    url: "https://supabase.com/",
  },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white pt-16 pb-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 mb-12">
          {/* About Section */}
          <div>
            <motion.h3
              {...simpleSlideIn}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
            >
              About CampusBeacon
            </motion.h3>
            <p className="text-gray-400 text-base mb-6">
              Your comprehensive campus companion, connecting students with
              resources, opportunities, and each other.
            </p>
            <motion.div {...simpleFadeIn} className="flex space-x-5">
              <a
                href="https://twitter.com/campusbeacon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="CampusBeacon Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com/campusbeacon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="CampusBeacon Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://github.com/campusbeacon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="CampusBeacon Github"
              >
                <FaGithub size={24} />
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
            <div className="space-y-4 text-base">
              <motion.a
                {...simpleSlideIn}
                href="mailto:campusbeacon0@gmail.com"
                className="flex items-center space-x-4 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <HiMail className="text-xl flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <span>campusbeacon0@gmail.com</span>
              </motion.a>
              <motion.a
                {...simpleSlideIn}
                href="tel:+919548999129"
                className="flex items-center space-x-4 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <HiPhone className="text-xl flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <span>+91 9548999129</span>
              </motion.a>
              <motion.a
                {...simpleSlideIn}
                href="https://maps.app.goo.gl/tMuCf5DjfXLF3YuDA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <HiLocationMarker className="text-xl flex-shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                <span>MNNIT Allahabad, Prayagraj, India</span>
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
            <div className="grid grid-cols-4 gap-5">
              {technologies.map(({ Icon, name, color, url }) => (
                <motion.a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  aria-label={`Link to ${name} website`}
                  {...simpleFadeIn}
                  className={`text-gray-400 ${color} transition-colors cursor-pointer flex justify-center items-center transform hover:scale-110`}
                >
                  <Icon size={28} />
                </motion.a>
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
            <div className="space-y-6 text-base">
              <motion.div {...simpleSlideIn}>
                <h4 className="font-semibold text-white mb-1">Ayush Jadaun</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Full Stack Developer
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/ayush-jadaun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Ayush Jadaun Github"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayush-jadaun-677199311/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label="Ayush Jadaun LinkedIn"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href="mailto:ayushjadaun6@gmail.com"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Email Ayush Jadaun"
                  >
                    <FaEnvelope size={20} />
                  </a>
                </div>
              </motion.div>
              <motion.div {...simpleSlideIn}>
                <h4 className="font-semibold text-white mb-1">Ayush Agarwal</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Full Stack Developer
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/ayushagr101"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Ayush Agarwal Github"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayush-agarwal-108127311/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label="Ayush Agarwal LinkedIn"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href="mailto:ayush.agr160@gmail.com"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Email Ayush Agarwal"
                  >
                    <FaEnvelope size={20} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <motion.p
              {...simpleFadeIn}
              className="text-gray-500 text-sm text-center sm:text-left"
            >
              © {new Date().getFullYear()} CampusBeacon. All rights reserved.
            </motion.p>
            <motion.div
              {...simpleFadeIn}
              className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-8"
            >
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
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all z-50"
        aria-label="Scroll to top"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        {...simpleFadeIn}
      >
        <HiArrowUp size={22} />
      </motion.button>
    </footer>
  );
};

export default Footer;
