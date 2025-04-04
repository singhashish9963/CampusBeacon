import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiPhone,
  FiPlus,
  FiLoader,
  FiMail,
} from "react-icons/fi";
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import {
  fetchCoordinators,
  deleteCoordinator,
  clearCoordinatorError,
} from "../../slices/coordinatorSlice";
import toast from "react-hot-toast";

const getSocialIcon = (link = "") => {
  if (typeof link !== "string") return <FiPlus />;
  if (link.includes("instagram.com"))
    return <FaInstagram className="text-[#E1306C]" />;
  if (link.includes("linkedin.com"))
    return <FaLinkedin className="text-[#0077B5]" />;
  if (link.includes("facebook.com"))
    return <FaFacebook className="text-[#1877F2]" />;
  if (link.includes("twitter.com"))
    return <FaTwitter className="text-[#1DA1F2]" />;
  return <FaGlobe className="text-gray-400" />;
};

const CoordinatorList = ({ isAdmin, openModal, clubId }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(null);
  const { coordinators, loading, error } = useSelector(
    (state) => state.coordinators
  );

  useEffect(() => {
    if (clubId) {
      dispatch(fetchCoordinators(clubId));
    }
    return () => {
      if (error) {
        dispatch(clearCoordinatorError());
      }
    };
  }, [dispatch, clubId, error]);

  const handleDeleteCoordinator = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to remove ${name} from the team?`)
    ) {
      setIsDeleting(id);
      try {
        await dispatch(deleteCoordinator(id)).unwrap();
        toast.success(`${name} has been removed from the team`);
      } catch (err) {
        toast.error(
          `Failed to remove coordinator: ${err.message || "Unknown error"}`
        );
        console.error("Failed to delete coordinator:", err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
            Meet the Team
          </h2>
          <p className="text-gray-400 mt-2">
            Get to know our amazing coordinators
          </p>
        </div>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              openModal("coordinator", "create", { club_id: clubId })
            }
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-cyan-500/20 font-medium"
            disabled={loading}
          >
            <FiPlus className="mr-2" /> Add Coordinator
          </motion.button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin text-cyan-400 text-4xl mb-4" />
            <span className="text-gray-400 animate-pulse">
              Loading Team Members...
            </span>
          </div>
        </div>
      )}

      {!loading && error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 text-red-400 bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-700/50 p-6 shadow-lg"
        >
          <p className="mb-2">Unable to load team members:</p>
          <p className="font-semibold">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (clubId) dispatch(fetchCoordinators(clubId));
            }}
            className="mt-5 px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm transition-colors shadow-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      {!loading && !error && (
        <>
          {coordinators.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {coordinators.map((coord) => (
                  <motion.div
                    layout
                    key={coord.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-cyan-500/10 backdrop-blur-sm hover:border-cyan-700/50 transition-all duration-300 relative group"
                  >
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            openModal("coordinator", "edit", coord)
                          }
                          className="p-2 bg-blue-600/90 hover:bg-blue-500 rounded-full text-white shadow-lg hover:shadow-blue-500/30 transition"
                          aria-label="Edit Coordinator"
                        >
                          <FiEdit size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleDeleteCoordinator(coord.id, coord.name)
                          }
                          className="p-2 bg-red-600/90 hover:bg-red-500 rounded-full text-white shadow-lg hover:shadow-red-500/30 transition"
                          aria-label="Delete Coordinator"
                          disabled={isDeleting === coord.id}
                        >
                          {isDeleting === coord.id ? (
                            <FiLoader className="animate-spin" size={14} />
                          ) : (
                            <FiTrash2 size={14} />
                          )}
                        </motion.button>
                      </div>
                    )}

                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-5 w-28 h-28">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-60 scale-105 animate-pulse-slow"></div>
                        <img
                          src={
                            Array.isArray(coord.images) &&
                            coord.images.length > 0
                              ? coord.images[0]
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  coord.name
                                )}&background=0284c7&color=fff&size=128`
                          }
                          alt={coord.name}
                          className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-cyan-400/80 relative z-10"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              coord.name
                            )}&background=0284c7&color=fff&size=128`;
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 tracking-wide">
                        {coord.name}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-cyan-300 text-xs font-medium mb-3">
                        {coord.designation}
                      </span>

                      {coord.contact && (
                        <p className="text-sm text-gray-300 mt-2 flex items-center justify-center">
                          <FiPhone size={14} className="mr-2 text-cyan-400" />
                          <span>{coord.contact}</span>
                        </p>
                      )}

                      {Array.isArray(coord.social_media_links) &&
                        coord.social_media_links.length > 0 && (
                          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
                            {coord.social_media_links.map((link, i) => (
                              <motion.a
                                key={i}
                                whileHover={{ scale: 1.2, y: -2 }}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cyan-300 transition-all duration-200 text-lg"
                                aria-label={`${
                                  coord.name
                                }'s social media profile ${i + 1}`}
                              >
                                {getSocialIcon(link)}
                              </motion.a>
                            ))}
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/20 border border-gray-700/40 rounded-xl p-10 text-center shadow-lg"
            >
              <FiLoader className="mx-auto text-3xl text-gray-500 mb-4" />
              <p className="text-gray-400 mb-2">
                No team members found for this club
              </p>
              {isAdmin && (
                <p className="text-sm text-gray-500">
                  Start by adding your first coordinator using the button above
                </p>
              )}
            </motion.div>
          )}
        </>
      )}
    </section>
  );
};

export default CoordinatorList;
