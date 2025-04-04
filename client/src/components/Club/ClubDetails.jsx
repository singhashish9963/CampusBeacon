import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiInfo, FiExternalLink } from "react-icons/fi";
import { FaInstagram, FaLinkedin, FaFacebook, FaLink } from "react-icons/fa";
import ImageGallery from "./ImageGallery";

const getSocialIcon = (url = "") => {
  try {
    if (typeof url !== "string" || !url.trim())
      return <FaLink className="text-lg" />;
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("instagram.com"))
      return <FaInstagram className="text-lg" />;
    if (hostname.includes("linkedin.com"))
      return <FaLinkedin className="text-lg" />;
    if (hostname.includes("facebook.com"))
      return <FaFacebook className="text-lg" />;
  } catch (e) {}
  return <FaLink className="text-lg" />;
};

const ClubDetails = ({ club, isAdmin, isCoordinator, onEditClick }) => {
  const [isHovering, setIsHovering] = useState(null);

  if (!club) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-cyan-500/40 border-b-cyan-500/20 border-l-cyan-500/20 animate-spin"></div>
            <div className="absolute inset-0 rounded-full bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 bg-cyan-500/80 rounded-full animate-bounce"></div>
            </div>
          </div>
          <span className="text-xl font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Loading club details...
          </span>
        </div>
      </div>
    );
  }

  const canEdit = isAdmin || isCoordinator;
  const hasSocialLinks =
    Array.isArray(club.social_media_links) &&
    club.social_media_links.filter((link) => link && link.trim()).length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 12 },
    },
  };

  const galleryVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600/30 filter blur-3xl mix-blend-screen"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 filter blur-3xl mix-blend-screen"></div>
        <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-amber-500/20 filter blur-3xl mix-blend-screen"></div>
      </div>

      <motion.div
        variants={itemVariants}
        className="relative mb-16 flex justify-between items-start"
      >
        <div className="relative flex-1 mr-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 tracking-tight drop-shadow-sm">
            {club.name}
          </h1>
          {/* Animated underline elements */}
          <div className="absolute -bottom-2 left-0 h-2 w-32 md:w-40 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
          <div className="absolute -bottom-2 left-0 h-2 w-20 md:w-24 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-600 rounded-full blur-md animate-pulse"></div>
          <div className="absolute -bottom-6 left-8 h-1 w-16 bg-cyan-500/50 rounded-full blur-sm animate-pulse"></div>
        </div>
        {canEdit && (
          <motion.button
            onClick={onEditClick}
            className="flex-shrink-0 p-3.5 rounded-full text-gray-200 bg-gradient-to-br from-gray-800/90 to-gray-900/90 hover:text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 backdrop-blur-sm border border-gray-700/50 group"
            aria-label="Edit Club Details"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiEdit size={22} className="group-hover:animate-pulse" />
          </motion.button>
        )}
      </motion.div>

      <div className="grid md:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-start">
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 bg-gradient-to-br from-gray-800/70 via-gray-900/60 to-gray-800/60 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 group relative overflow-hidden"
          onMouseEnter={() => setIsHovering("main")}
          onMouseLeave={() => setIsHovering(null)}
        >
          {/* Interactive background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div
            className={`absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl transition-opacity duration-700 -translate-x-12 -translate-y-12 ${
              isHovering === "main" ? "opacity-40" : "opacity-0"
            }`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full filter blur-3xl transition-opacity duration-700 translate-x-12 translate-y-12 ${
              isHovering === "main" ? "opacity-30" : "opacity-0"
            }`}
          ></div>

          <div className="relative">
            <p
              className={`text-xl text-gray-200 leading-relaxed mb-8 font-light tracking-wide ${
                isHovering === "main" ? "text-white" : ""
              }`}
            >
              {club.description || (
                <span className="flex items-center text-gray-400 italic">
                  <FiInfo className="mr-2 text-cyan-400" />
                  No description provided for this club.
                </span>
              )}
            </p>

            {hasSocialLinks && (
              <div className="relative mt-12">
                <div className="absolute -top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 mb-6 pb-1">
                  Connect With Us
                </h3>
                <div className="flex flex-wrap gap-6">
                  {club.social_media_links.map(
                    (link, idx) =>
                      link &&
                      link.trim() && (
                        <motion.a
                          key={`${club.id}-social-${idx}`}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-700/70 to-gray-800/70 rounded-full hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-600 transition-all duration-300 text-gray-300 hover:text-white shadow-md hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-600/50 hover:border-amber-500/50 relative group/link"
                          aria-label={`Visit ${new URL(link).hostname}`}
                          whileHover={{ y: -5, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setIsHovering(`social-${idx}`)}
                          onMouseLeave={() => setIsHovering(null)}
                        >
                          {getSocialIcon(link)}
                          <AnimatePresence>
                            {isHovering === `social-${idx}` && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-300 bg-gray-800/90 px-2 py-1 rounded-md shadow-lg"
                              >
                                <span className="flex items-center gap-1">
                                  <FiExternalLink size={10} />
                                  {new URL(link).hostname.replace("www.", "")}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.a>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={galleryVariants}
          className="md:col-span-2 h-full"
          onMouseEnter={() => setIsHovering("gallery")}
          onMouseLeave={() => setIsHovering(null)}
        >
          <div className="bg-gradient-to-br from-gray-800/70 via-gray-900/60 to-gray-800/60 p-7 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 relative overflow-hidden group">
            {/* Gallery hover effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div
              className={`absolute -bottom-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full filter blur-3xl transition-opacity duration-700 ${
                isHovering === "gallery" ? "opacity-30" : "opacity-0"
              }`}
            ></div>

            <div className="relative">
              <ImageGallery images={club.images} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClubDetails;
