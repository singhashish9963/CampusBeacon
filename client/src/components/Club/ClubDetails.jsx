import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiInfo, FiExternalLink } from "react-icons/fi";
import { FaInstagram, FaLinkedin, FaFacebook, FaLink } from "react-icons/fa";
import ImageGallery from "./ImageGallery";

const getSocialIcon = (url = "") => {
  try {
    if (typeof url !== "string" || !url.trim()) return <FaLink className="text-lg" />;
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("instagram.com")) return <FaInstagram className="text-lg" />;
    if (hostname.includes("linkedin.com")) return <FaLinkedin className="text-lg" />;
    if (hostname.includes("facebook.com")) return <FaFacebook className="text-lg" />;
  } catch (e) {}
  return <FaLink className="text-lg" />;
};

const ClubDetails = ({
  club,
  isAdmin,
  isCoordinator,
  themeStyles = {},
  onEditClick,
}) => {
  const [isHovering, setIsHovering] = useState(null);

  if (!club) {
    return (
      <div className="flex items-center justify-center min-h-[20vh] text-gray-400 p-4">
        <span>Loading club details...</span>
      </div>
    );
  }

  const canEdit = isAdmin || isCoordinator;
  const hasSocialLinks =
    Array.isArray(club.social_media_links) &&
    club.social_media_links.some(
      (link) => typeof link === "string" && link.trim()
    );

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
      <motion.div
        variants={itemVariants}
        className="relative mb-12 md:mb-16 flex justify-between items-start gap-4"
      >
        <div className="relative flex-1 mr-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 tracking-tight drop-shadow-sm">
            {club.name}
          </h1>
          <div className="absolute -bottom-2 left-0 h-1.5 w-28 md:w-36 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
          <div className="absolute -bottom-2 left-0 h-1.5 w-16 md:w-24 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-600 rounded-full blur-md animate-pulse"></div>
        </div>
        {canEdit && (
          <motion.button
            onClick={onEditClick}
            className="flex-shrink-0 p-3 rounded-full text-gray-200 bg-gradient-to-br from-gray-800/70 to-gray-900/70 hover:text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 backdrop-blur-sm border border-gray-700/50 group"
            aria-label="Edit Club Details"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiEdit size={20} className="group-hover:animate-pulse" />
          </motion.button>
        )}
      </motion.div>
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-start">
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 bg-gradient-to-br from-gray-800/50 via-gray-900/40 to-gray-800/40 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-700/40 hover:border-gray-600/60 transition-colors duration-500 group relative overflow-hidden"
          onMouseEnter={() => setIsHovering("main")}
          onMouseLeave={() => setIsHovering(null)}
        >
          <div className="relative">
            <p
              className={`text-base md:text-lg text-gray-300 leading-relaxed mb-8 font-light tracking-wide transition-colors duration-300 ${
                isHovering === "main" ? "text-gray-100" : ""
              }`}
            >
              {club.description || (
                <span className="flex items-center text-gray-400 italic">
                  <FiInfo className="mr-2 text-cyan-400 flex-shrink-0" />
                  No description provided for this club.
                </span>
              )}
            </p>
            {hasSocialLinks && (
              <div className="relative mt-10 pt-6 border-t border-gray-700/50">
                <h3 className="text-xl font-semibold text-gray-200 mb-5">
                  Connect With Us
                </h3>
                <div className="flex flex-wrap gap-4 sm:gap-5">
                  {club.social_media_links.map(
                    (link, idx) =>
                      typeof link === "string" && link.trim() ? (
                        <motion.a
                          key={`${club.id}-social-${idx}`}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-full hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-600 transition-all duration-300 text-gray-400 hover:text-white shadow-md hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-600/40 hover:border-amber-500/40 relative group/link"
                          aria-label={`Visit social media link ${idx + 1}`}
                          whileHover={{ y: -4, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onMouseEnter={() => setIsHovering(`social-${idx}`)}
                          onMouseLeave={() => setIsHovering(null)}
                        >
                          {getSocialIcon(link)}
                          <AnimatePresence>
                            {isHovering === `social-${idx}` && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-200 bg-gray-900 px-2 py-1 rounded shadow-lg pointer-events-none"
                              >
                                <span className="flex items-center gap-1">
                                  <FiExternalLink size={10} />
                                  {(() => {
                                    try {
                                      return new URL(link).hostname.replace(
                                        "www.",
                                        ""
                                      );
                                    } catch {
                                      return "Link";
                                    }
                                  })()}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.a>
                      ) : null
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
          <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/40 to-gray-800/40 p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-700/40 hover:border-gray-600/60 transition-colors duration-500 relative overflow-hidden group h-full">
            <div className="relative h-full">
              {club.images && club.images.length > 0 ? (
                <ImageGallery images={club.images} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 italic bg-gray-800/30 rounded-lg">
                  No images available for this club.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClubDetails;
