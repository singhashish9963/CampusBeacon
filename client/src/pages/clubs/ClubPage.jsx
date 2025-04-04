import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  FiLoader,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiAlertTriangle,
  FiInfo,
  FiTrash2,
} from "react-icons/fi";

import { fetchClubs, clearClubError, deleteClub } from "../../slices/clubSlice";
import { clearCoordinatorError as clearCoordErr } from "../../slices/coordinatorSlice";
import { clearEventError as clearEventErr } from "../../slices/eventSlice";

// Lazy loaded components for better performance
const ClubDetails = lazy(() => import("../../components/Club/ClubDetails"));
const CoordinatorList = lazy(() =>
  import("../../components/Club/CoordinatorList")
);
const EventList = lazy(() => import("../../components/Club/EventList"));

// Also lazy load modals as they're not needed on initial render
const ClubFormModal = lazy(() =>
  import("../../components/Modals/ClubFormModal")
);
const CoordinatorFormModal = lazy(() =>
  import("../../components/Modals/CoordinatorFormModal")
);
const EventFormModal = lazy(() =>
  import("../../components/Modals/EventFormModal")
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full min-h-32">
    <FiLoader className="animate-spin text-amber-400 text-3xl" />
  </div>
);

const MNNITClubPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    clubs = [],
    loading: clubsLoading,
    error: clubsError,
  } = useSelector((state) => state.clubs);
  const {
    user,
    roles = [],
    isAuthenticated,
  } = useSelector((state) => state.auth);

  const [currentClubIndex, setCurrentClubIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    mode: "create",
    data: null,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch clubs only once when component mounts
  useEffect(() => {
    if (clubs.length === 0 && !clubsLoading) {
      dispatch(fetchClubs());
    }
  }, [dispatch, clubs.length, clubsLoading]);

  // Adjust current index if clubs array changes
  useEffect(() => {
    if (currentClubIndex >= clubs.length && clubs.length > 0) {
      setCurrentClubIndex(clubs.length - 1);
    }
  }, [clubs.length, currentClubIndex]);

  const currentClub =
    clubs.length > 0 && currentClubIndex >= 0 && currentClubIndex < clubs.length
      ? clubs[currentClubIndex]
      : null;

  const isAdmin = isAuthenticated && roles.includes("admin");
  const isCurrentUserCoordinator = Boolean(
    currentClub &&
      user &&
      isAuthenticated &&
      currentClub.coordinators?.some((coord) => coord.userId === user._id)
  );

  // Memoized functions to prevent unnecessary re-renders
  const openModal = useCallback(
    (type, mode, item = null) => {
      let modalData = item;
      if (
        (type === "coordinator" || type === "event") &&
        mode === "create" &&
        currentClub
      ) {
        modalData = { ...(item || {}), club_id: currentClub.id };
      }
      setModalState({ isOpen: true, type, mode, data: modalData });
    },
    [currentClub]
  );

  const closeModal = useCallback(() => {
    const type = modalState.type;
    setModalState({ isOpen: false, type: null, mode: "create", data: null });
    if (type === "coordinator") dispatch(clearCoordErr());
    if (type === "event") dispatch(clearEventErr());
    if (type === "club" && clubsError) dispatch(clearClubError());
  }, [dispatch, modalState.type, clubsError]);

  const handleEventClick = useCallback(
    (id) => navigate(`/events/${id}`),
    [navigate]
  );

  const navigateClub = useCallback(
    (direction) => {
      if (isTransitioning || clubs.length <= 1) return;
      setIsTransitioning(true);
      setCurrentClubIndex((prevIndex) => {
        const newIndex =
          direction === "next"
            ? (prevIndex + 1) % clubs.length
            : (prevIndex - 1 + clubs.length) % clubs.length;
        return newIndex;
      });
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [clubs.length, isTransitioning]
  );

  const handleNextClub = useCallback(
    () => navigateClub("next"),
    [navigateClub]
  );
  const handlePrevClub = useCallback(
    () => navigateClub("prev"),
    [navigateClub]
  );

  const handleDeleteClub = useCallback(() => {
    if (!currentClub) return;
    if (showDeleteConfirm) {
      dispatch(deleteClub(currentClub.id))
        .unwrap()
        .then(() => {
          toast.success(`${currentClub.name} has been deleted`);
          setShowDeleteConfirm(false);
        })
        .catch(() => setShowDeleteConfirm(false));
    } else {
      setShowDeleteConfirm(true);
      // Automatically hide after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  }, [currentClub, dispatch, showDeleteConfirm]);

  // Loading state
  if (clubsLoading && clubs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-center p-4">
        <FiLoader className="animate-spin text-amber-400 text-5xl mb-4" />
        <p className="text-lg text-gray-300">Loading Clubs...</p>
      </div>
    );
  }

  // Error state
  if (clubsError && !clubsLoading && clubs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 p-8 rounded-xl shadow-2xl border border-red-700/50 max-w-lg"
        >
          <FiAlertTriangle className="text-red-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-3">
            Failed to Load Clubs
          </h2>
          <p className="text-gray-300 mb-6">{clubsError}</p>
          <button
            onClick={() => {
              dispatch(clearClubError());
              dispatch(fetchClubs());
            }}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (!clubsLoading && clubs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 p-8 rounded-xl shadow-2xl max-w-md border border-gray-700/50"
        >
          <FiInfo className="text-amber-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">
            No Clubs Available
          </h2>
          <p className="text-gray-400 mb-6">
            There are currently no clubs to display.
          </p>
          {isAdmin && (
            <button
              onClick={() => openModal("club", "create")}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:brightness-110 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800 inline-flex items-center"
            >
              <FiPlus className="mr-2" /> Create First Club
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white overflow-x-hidden relative pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8 mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
          MNNIT Clubs
        </h1>
        <p className="text-blue-400 text-lg">Connect with Campus Communities</p>
      </motion.div>

      {/* Navigation controls */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-sm font-medium text-blue-400">
          {clubs.length > 1 ? (
            <span>
              Club {currentClubIndex + 1} of {clubs.length}
            </span>
          ) : (
            <span>1 Club</span>
          )}
        </div>

        <div className="flex space-x-2">
          {isAdmin && currentClub && (
            <>
              <button
                onClick={() => openModal("club", "create")}
                className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-sm shadow-md hover:brightness-110 transition-all duration-300 flex items-center"
              >
                <FiPlus className="mr-1" /> New Club
              </button>
              {showDeleteConfirm ? (
                <button
                  onClick={handleDeleteClub}
                  className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg font-medium text-sm shadow-md hover:brightness-110 transition-all duration-300 flex items-center animate-pulse"
                >
                  <FiTrash2 className="mr-1" /> Confirm
                </button>
              ) : (
                <button
                  onClick={handleDeleteClub}
                  className="px-3 py-2 bg-gray-800/30 hover:bg-gray-700 text-white rounded-lg font-medium text-sm shadow-md transition-all duration-300 flex items-center border border-gray-700"
                  title={`Delete ${currentClub?.name || "Club"}`}
                >
                  <FiTrash2 />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 pt-2 pb-10 md:pt-6 md:pb-16 relative">
        <AnimatePresence mode="wait">
          {currentClub && (
            <motion.div
              key={currentClub.id}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-10 md:space-y-16"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <ClubDetails
                  club={currentClub}
                  isAdmin={isAdmin}
                  isCoordinator={isCurrentUserCoordinator}
                  onEditClick={() => openModal("club", "edit", currentClub)}
                  // Apply the new theme styles to child components through props
                  themeStyles={{
                    cardBg: "bg-gray-800/30",
                    borderColor: "border-gray-700",
                    headingColor: "text-amber-400",
                    buttonGradient: "from-amber-500 to-orange-600",
                  }}
                />
              </Suspense>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <CoordinatorList
                    isAdmin={isAdmin}
                    openModal={openModal}
                    clubId={currentClub.id}
                    // Apply the new theme styles
                    themeStyles={{
                      headingColor: "text-amber-400",
                      buttonGradient: "from-amber-500 to-orange-600",
                    }}
                  />
                </Suspense>
              </motion.div>

              <hr className="border-t border-gray-700/50 my-8 md:my-12" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <EventList
                    isAdmin={isAdmin}
                    isCoordinator={isCurrentUserCoordinator}
                    openModal={openModal}
                    handleEventClick={handleEventClick}
                    clubId={currentClub.id}
                    // Apply the new theme styles
                    themeStyles={{
                      headingColor: "text-amber-400",
                      buttonGradient: "from-amber-500 to-orange-600",
                      cardBg: "bg-gray-900/50",
                      tagBg: "bg-amber-500/20",
                      tagText: "text-amber-400",
                    }}
                  />
                </Suspense>
              </motion.div>
            </motion.div>
          )}
          {!currentClub && clubs.length > 0 && (
            <div className="h-96 flex items-center justify-center">
              <FiLoader className="animate-spin text-amber-400 text-4xl" />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {clubs.length > 1 && (
        <>
          <motion.button
            onClick={handlePrevClub}
            disabled={isTransitioning}
            aria-label={`Previous Club: ${
              clubs[(currentClubIndex - 1 + clubs.length) % clubs.length]
                ?.name || ""
            }`}
            className="fixed top-1/2 left-1 md:left-3 z-30 transform -translate-y-1/2 disabled:opacity-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 text-white hover:text-amber-400 group shadow-lg">
              <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {clubs[(currentClubIndex - 1 + clubs.length) % clubs.length]
                  ?.name || ""}
              </span>
            </div>
          </motion.button>
          <motion.button
            onClick={handleNextClub}
            disabled={isTransitioning}
            aria-label={`Next Club: ${
              clubs[(currentClubIndex + 1) % clubs.length]?.name || ""
            }`}
            className="fixed top-1/2 right-1 md:right-3 z-30 transform -translate-y-1/2 disabled:opacity-50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 text-white hover:text-amber-400 group shadow-lg">
              <FiArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {clubs[(currentClubIndex + 1) % clubs.length]?.name || ""}
              </span>
            </div>
          </motion.button>
        </>
      )}

      {/* Modals */}
      {modalState.isOpen && (
        <Suspense fallback={null}>
          {modalState.type === "club" && (
            <ClubFormModal
              isOpen={true}
              onClose={closeModal}
              mode={modalState.mode}
              initialData={modalState.data}
              themeStyles={{
                headingColor: "text-amber-400",
                buttonGradient: "from-amber-500 to-orange-600",
                modalBg: "bg-gray-900",
                borderColor: "border-gray-700",
              }}
            />
          )}
          {modalState.type === "coordinator" && (
            <CoordinatorFormModal
              isOpen={true}
              onClose={closeModal}
              mode={modalState.mode}
              initialData={modalState.data}
              themeStyles={{
                headingColor: "text-amber-400",
                buttonGradient: "from-amber-500 to-orange-600",
                modalBg: "bg-gray-900",
                borderColor: "border-gray-700",
              }}
            />
          )}
          {modalState.type === "event" && (
            <EventFormModal
              isOpen={true}
              onClose={closeModal}
              mode={modalState.mode}
              initialData={modalState.data}
              themeStyles={{
                headingColor: "text-amber-400",
                buttonGradient: "from-amber-500 to-orange-600",
                modalBg: "bg-gray-900",
                borderColor: "border-gray-700",
              }}
            />
          )}
        </Suspense>
      )}
    </div>
  );
};

export default MNNITClubPage;
