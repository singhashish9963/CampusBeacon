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
  FiUsers,
} from "react-icons/fi";
import {
  FaInstagram,
  FaLinkedin,
  FaFacebookF,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import {
  fetchCoordinators,
  deleteCoordinator,
  clearCoordinatorError,
} from "../../slices/coordinatorSlice";
import toast from "react-hot-toast";

const getSocialDetails = (link = "") => {
  if (typeof link !== "string" || !link)
    return { Icon: FaGlobe, colorClass: "text-gray-400 hover:text-gray-300" };
  if (link.includes("instagram.com"))
    return {
      Icon: FaInstagram,
      colorClass: "text-[#E1306C] hover:text-[#c72a5f]",
    };
  if (link.includes("linkedin.com"))
    return {
      Icon: FaLinkedin,
      colorClass: "text-[#0077B5] hover:text-[#005e90]",
    };
  if (link.includes("facebook.com"))
    return {
      Icon: FaFacebookF,
      colorClass: "text-[#1877F2] hover:text-[#125fb3]",
    };
  if (link.includes("twitter.com"))
    return {
      Icon: FaTwitter,
      colorClass: "text-[#1DA1F2] hover:text-[#17a8de]",
    };
  if (link.includes("mailto:"))
    return { Icon: FiMail, colorClass: "text-amber-400 hover:text-amber-300" };
  return { Icon: FaGlobe, colorClass: "text-gray-400 hover:text-gray-300" };
};

const ListLoadingSkeleton = () => (
  <div className="flex justify-center items-center py-16">
    <div className="flex flex-col items-center space-y-3">
      <FiLoader className="animate-spin text-cyan-400 text-5xl" />
      <span className="text-gray-400 animate-pulse text-lg">
        Loading Team Members...
      </span>
    </div>
  </div>
);

const ListErrorState = ({ error, onRetry, clubId }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-10 text-red-400 bg-red-900/10 backdrop-blur-sm rounded-xl border border-red-700/30 p-6 shadow-lg flex flex-col items-center space-y-4"
  >
    <FiUsers size={40} className="text-red-500/70" />
    <p className="font-semibold text-lg">Oops! Could not load the team.</p>
    <p className="text-red-400/80 text-sm max-w-md">
      {typeof error === "string" ? error : "An unknown error occurred."}
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onRetry(clubId)}
      className="mt-3 px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm transition-colors shadow-lg"
    >
      Try Again
    </motion.button>
  </motion.div>
);

const NoCoordinatorsMessage = ({ isAdmin, isPassedData }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`${
      isPassedData
        ? "py-4 text-center"
        : "bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700/40 rounded-xl p-8 md:p-12 text-center shadow-lg"
    } flex flex-col items-center space-y-4`}
  >
    <FiUsers
      className={`text-4xl ${isPassedData ? "text-gray-500" : "text-gray-500/80 mb-3"}`}
    />
    <h3 className="text-lg font-semibold text-gray-300">
      {isPassedData ? "No Coordinators Assigned" : "No Team Members Yet"}
    </h3>
    <p className="text-gray-400/90 text-sm max-w-xs">
      {isPassedData
        ? "This event doesn't have any coordinators listed."
        : "Looks like the team roster is currently empty for this club."}
    </p>
    {!isPassedData && isAdmin && (
      <p className="text-xs text-gray-500 mt-1">
        Use the "+ Add Coordinator" button above to build the team!
      </p>
    )}
  </motion.div>
);

const CoordinatorList = ({
  isAdmin = false,
  openModal,
  clubId = null,
  coordinators: passedCoordinators = null,
  showTitleSection = true,
  showContact = true,
  showSocial = true,
  gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  cardLayout = "detailed",
  maxVisible = 4,
}) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(null);
  const [confirmDeleteData, setConfirmDeleteData] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const isUsingPassedData = Array.isArray(passedCoordinators);
  const shouldFetch = !isUsingPassedData && clubId != null;

  const {
    coordinators: fetchedCoordinators,
    loading: fetchedLoading,
    error: fetchedError,
  } = useSelector((state) =>
    shouldFetch
      ? state.coordinators
      : { coordinators: [], loading: false, error: null }
  );

  const listToDisplay = isUsingPassedData ? passedCoordinators : fetchedCoordinators;
  const isLoading = shouldFetch && fetchedLoading;
  const displayError = shouldFetch && fetchedError;

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchCoordinators(clubId));
    }
  }, [dispatch, clubId, shouldFetch]);

  useEffect(() => {
    if (displayError) {
      const toastId = `coord-error-${clubId || "passed"}`;
      toast.error(`Error loading team: ${displayError}`, { id: toastId });
    }
  }, [displayError, clubId, dispatch]);

  const handleRetryFetch = (id) => {
    if (shouldFetch && id) {
      dispatch(fetchCoordinators(id));
    }
  };

  const handleDeleteCoordinator = (id, name) => {
    if (!isAdmin) return;
    setConfirmDeleteData({ id, name });
  };

  const performDelete = async (id, name) => {
    if (!isAdmin) return;
    setIsDeleting(id);
    try {
      await dispatch(deleteCoordinator(id)).unwrap();
      toast.success(`${name} removed successfully`);
    } catch (err) {
      const errorMessage =
        err?.message || err?.error || "Failed to remove coordinator";
      toast.error(`Error: ${errorMessage}`);
      console.error("Failed to delete coordinator:", err);
    } finally {
      setIsDeleting(null);
      setConfirmDeleteData(null);
    }
  };

  const containerVariants = {};

  const itemVariants = {};

  const adminButtonVariants = {};

  const coordinatorsToRender = listToDisplay ?? [];
  const displayedCoordinators = showAll
    ? coordinatorsToRender
    : coordinatorsToRender.slice(0, maxVisible);

  const renderCoordinatorCard = (coord) => {
    const isSimpleLayout = cardLayout === "simple";
    const cardClasses = isSimpleLayout
      ? "bg-gradient-to-br from-gray-800/60 to-gray-900/50 rounded-xl p-4 border border-gray-700/50 shadow-lg group relative flex items-center gap-4"
      : "bg-gradient-to-br from-gray-800/70 via-gray-800/40 to-gray-900/70 rounded-2xl p-6 border border-gray-700/60 shadow-xl hover:shadow-cyan-500/15 backdrop-blur-lg group relative overflow-hidden hover:border-cyan-600/70 transition-all duration-300 ease-out flex flex-col";
    const imageSizeClass = isSimpleLayout ? "w-16 h-16" : "w-24 h-24";
    const imageWrapperSizeClass = isSimpleLayout ? "w-16 h-16" : "w-28 h-28";
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      coord.name || "N A"
    )}&background=${isSimpleLayout ? "2563eb" : "1d4ed8"}&color=fff&size=${
      isSimpleLayout ? "96" : "128"
    }&font-size=0.4&bold=true`;
    const imageUrl =
      Array.isArray(coord.images) && coord.images.length > 0
        ? coord.images[0]
        : avatarUrl;

    return (
      <motion.div
        layout
        key={coord.id}
        variants={itemVariants}
        exit="exit"
        className={cardClasses}
        whileHover={!isSimpleLayout ? { y: -5 } : {}}
      >
        {isAdmin && openModal && (
          <div className="absolute top-3 right-3 z-20 flex space-x-1.5">
            <AnimatePresence>
              {isDeleting !== coord.id && (
                <>
                  <motion.button
                    key={`edit-${coord.id}`}
                    variants={adminButtonVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal("coordinator", "edit", coord)}
                    className="p-1.5 bg-blue-600/80 hover:bg-blue-500/90 rounded-full text-white shadow-md hover:shadow-blue-500/40 transition backdrop-blur-sm"
                    aria-label="Edit Coordinator"
                  >
                    <FiEdit size={13} />
                  </motion.button>
                  <motion.button
                    key={`delete-${coord.id}`}
                    variants={adminButtonVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleDeleteCoordinator(coord.id, coord.name)
                    }
                    className={`p-1.5 bg-red-600/80 hover:bg-red-500/90 rounded-full text-white shadow-md hover:shadow-red-500/40 transition ${
                      isDeleting === coord.id ? "cursor-not-allowed" : ""
                    }`}
                    aria-label="Delete Coordinator"
                    disabled={isDeleting === coord.id}
                    style={{ backdropFilter: "blur(4px)" }}
                  >
                    {isDeleting === coord.id ? (
                      <FiLoader className="animate-spin" size={13} />
                    ) : (
                      <FiTrash2 size={13} />
                    )}
                  </motion.button>
                </>
              )}
            </AnimatePresence>
            {isDeleting === coord.id && (
              <motion.div
                key={`deleting-${coord.id}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm"
              >
                <FiLoader className="animate-spin text-red-400" size={14} />
              </motion.div>
            )}
          </div>
        )}

        {isSimpleLayout ? (
          <>
            <img
              src={imageUrl}
              alt={coord.name || "Coordinator"}
              className={`${imageSizeClass} rounded-full object-cover border-2 border-gray-600 flex-shrink-0`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatarUrl;
              }}
              loading="lazy"
            />
            <div className="flex-grow overflow-hidden">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-0.5 leading-tight truncate">
                {coord.name || "Unnamed Coordinator"}
              </h3>
              <span className="text-cyan-300 text-xs font-medium block truncate">
                {coord.designation || "Team Member"}
              </span>
              {showContact && coord.contact && (
                <a
                  href={`tel:${coord.contact}`}
                  className="text-xs text-gray-400 hover:text-cyan-300 mt-1 flex items-center gap-1 truncate"
                >
                  <FiPhone size={11} /> {coord.contact}
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center pt-4 flex-grow">
            <div
              className={`relative mb-4 ${imageWrapperSizeClass} group-hover:scale-105 transition-transform duration-300 ease-out`}
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/60 via-blue-500/60 to-indigo-600/60 blur opacity-50 group-hover:opacity-70 group-hover:blur-md transition-all duration-400 animate-pulse-slow"></div>
              <img
                src={imageUrl}
                alt={coord.name || "Coordinator"}
                className={`${imageSizeClass} rounded-full object-cover shadow-lg border-3 border-gray-600/50 group-hover:border-cyan-500/70 transition-colors duration-300 relative z-10`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = avatarUrl;
                }}
                loading="lazy"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 tracking-tight leading-tight">
              {coord.name || "Unnamed Coordinator"}
            </h3>
            <span className="inline-block px-3 py-0.5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-full text-cyan-300 text-xs font-medium mb-3 border border-cyan-600/30">
              {coord.designation || "Team Member"}
            </span>
            <div className="flex-grow"></div>
            {showContact && coord.contact && (
              <p className="text-xs text-gray-300/80 mt-2 flex items-center justify-center group-hover:text-gray-200 transition-colors">
                <FiPhone size={12} className="mr-1.5 text-cyan-400/80" />
                <a href={`tel:${coord.contact}`} className="hover:underline">
                  {coord.contact}
                </a>
              </p>
            )}
            {showSocial &&
              Array.isArray(coord.social_media_links) &&
              coord.social_media_links.length > 0 && (
                <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-gray-700/40 w-full">
                  {coord.social_media_links
                    .filter((link) => link?.trim())
                    .slice(0, 4)
                    .map((link, i) => {
                      const { Icon, colorClass } = getSocialDetails(link);
                      return (
                        <motion.a
                          key={i}
                          whileHover={{ scale: 1.25, y: -2 }}
                          whileTap={{ scale: 1.1 }}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg transition-colors duration-200 ${colorClass}`}
                          aria-label={`${coord.name}'s social media profile ${i + 1}`}
                        >
                          <Icon />
                        </motion.a>
                      );
                    })}
                </div>
              )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section
      className={`${
        isUsingPassedData || !showTitleSection ? "py-4" : "py-8 md:py-12"
      }`}
    >
      {showTitleSection && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 pb-1">
              Meet the Team
            </h2>
            <p className="text-gray-400 mt-1 text-base">
              The driving force behind the club's success.
            </p>
          </div>
          {isAdmin && openModal && !isUsingPassedData && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                openModal("coordinator", "create", { club_id: clubId })
              }
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-cyan-500/30 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <FiPlus className="mr-2" size={18} /> Add Coordinator
            </motion.button>
          )}
        </div>
      )}

      {isLoading && <ListLoadingSkeleton />}

      {!isLoading && displayError && (
        <ListErrorState
          error={displayError}
          onRetry={handleRetryFetch}
          clubId={clubId}
        />
      )}

      {!isLoading && !displayError && (
        <>
          {coordinatorsToRender.length > 0 ? (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid ${gridClass} gap-5 md:gap-6`}
              >
                <AnimatePresence>
                  {displayedCoordinators.map(renderCoordinatorCard)}
                </AnimatePresence>
              </motion.div>

              {coordinatorsToRender.length > maxVisible && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium transition-all text-sm shadow-md hover:shadow-gray-500/20 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <NoCoordinatorsMessage
              isAdmin={isAdmin}
              isPassedData={isUsingPassedData}
            />
          )}
        </>
      )}

      {isAdmin && confirmDeleteData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-center shadow-xl border border-gray-700"
          >
            <p className="text-white text-lg mb-3">
              Remove <span className="font-semibold text-cyan-300">{confirmDeleteData.name}</span>?
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  performDelete(confirmDeleteData.id, confirmDeleteData.name)
                }
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmDeleteData(null)}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default CoordinatorList;
