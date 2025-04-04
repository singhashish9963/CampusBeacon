import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiLoader,
  FiArrowLeft,
  FiAlertTriangle,
  FiTrash2, // Only Trash icon needed in this component's direct UI
} from "react-icons/fi";

// Import actions
import {
  fetchClubById,
  deleteClub,
  clearClubError,
  setCurrentClub,
} from "../../slices/clubSlice"; // Adjust path
import { clearCoordinatorError as clearCoordErr } from "../../slices/coordinatorSlice"; // Adjust path
import { clearEventError as clearEventErr } from "../../slices/eventSlice"; // Adjust path

// --- Lazy loaded components ---
const ClubDetails = lazy(() => import("../../components/Club/ClubDetails")); // Adjust path
const CoordinatorList = lazy(() =>
  import("../../components/Club/CoordinatorList")
); // Adjust path
const EventList = lazy(() => import("../../components/Club/EventList")); // Adjust path
const ClubFormModal = lazy(() =>
  import("../../components/Modals/ClubFormModal")
); // Adjust path
const CoordinatorFormModal = lazy(() =>
  import("../../components/Modals/CoordinatorFormModal")
); // Adjust path
const EventFormModal = lazy(() =>
  import("../../components/Modals/EventFormModal")
); // Adjust path

// --- LoadingSpinner Component ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <FiLoader className="animate-spin text-amber-400 text-4xl" />
  </div>
);

// --- THE ClubDetailPage Component ---
const ClubDetailPage = () => {
  // Hooks
  const params = useParams();
  // Ensure your route uses :clubId or change this extraction logic
  const { clubId } = params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- State Selection ---
  const {
    currentClub: clubDataFromSlice,
    loading: clubLoading,
    error: clubError,
  } = useSelector((state) => state.clubs);
  const {
    user,
    roles = [],
    isAuthenticated,
  } = useSelector((state) => state.auth);

  // --- Local State for Modals & Delete ---
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    mode: "create",
    data: null,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- Derived State ---
  const currentClub =
    clubDataFromSlice && clubDataFromSlice.id === parseInt(clubId, 10)
      ? clubDataFromSlice
      : null;

  // --- Data Fetching Effect --- (Corrected Dependencies)
  useEffect(() => {
    if (clubId && clubId !== "undefined") {
      const needsFetch =
        !clubDataFromSlice || clubDataFromSlice.id !== parseInt(clubId, 10);
      // Only dispatch if fetch is needed AND not already loading
      if (needsFetch && !clubLoading) {
        dispatch(fetchClubById(clubId));
      }
    } else {
      console.error("useEffect: Invalid clubId provided in URL:", clubId);
    }
    // Cleanup: Runs ONLY on unmount or when clubId changes
    return () => {
      dispatch(setCurrentClub(null));
    };
  }, [dispatch, clubId]); // Dependencies correct now

  // --- Permissions ---
  const isAdmin = isAuthenticated && roles.includes("admin");
  const isCurrentUserCoordinator = Boolean(
    currentClub &&
      user &&
      isAuthenticated &&
      currentClub.coordinators?.some((coord) => coord.userId === user._id)
  );

  // --- Callbacks for Modals & Delete ---
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
      if (type === "club" && mode === "edit" && currentClub) {
        modalData = currentClub;
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
    if (type === "club" && clubError) dispatch(clearClubError());
  }, [dispatch, modalState.type, clubError]);

  const handleEventClick = useCallback(
    (id) => navigate(`/events/${id}`),
    [navigate]
  );

  const handleDeleteClub = useCallback(() => {
    if (!currentClub) return;
    if (showDeleteConfirm) {
      dispatch(deleteClub(currentClub.id))
        .unwrap()
        .then(() => {
          toast.success(`${currentClub.name} has been deleted`);
          navigate("/clubs", { replace: true });
        })
        .catch(() => {
          setShowDeleteConfirm(false);
        });
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 4000);
    }
  }, [currentClub, dispatch, showDeleteConfirm, navigate]);

  // --- Theme Styles (Passed down) ---
  const themeStyles = {
    cardBg: "bg-gray-800/30",
    borderColor: "border-gray-700",
    headingColor: "text-amber-400",
    buttonGradient: "from-amber-500 to-orange-600",
    modalBg: "bg-gray-900",
    eventCardBg: "bg-gray-900/50",
    eventTagBg: "bg-amber-500/20",
    eventTagText: "text-amber-400",
  };

  // --- RENDER LOGIC --- (Corrected Order and Conditions)

  // Condition 1: If we have club data, render the main content.
  // Optionally show subtle loading indicators if an update is in progress.
  if (currentClub) {
    return (
      // Apply slight opacity during background updates
      <div
        className={`min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white pb-12 ${
          clubLoading
            ? "opacity-80 transition-opacity duration-300"
            : "opacity-100"
        }`}
      >
        {/* Optional: Small loading indicator for background updates */}
        {clubLoading && (
          <div className="fixed top-5 right-5 z-[60] p-2 bg-gray-900/80 rounded-full shadow-lg animate-pulse">
            <FiLoader className="text-amber-400 text-lg animate-spin" />
          </div>
        )}

        {/* --- Header: Back Navigation & Admin Delete Action --- */}
        <div className="container mx-auto px-4 pt-6 pb-4 flex justify-between items-center sticky top-0 z-20 bg-gradient-to-b from-[#0B1026] via-[#0c112a] to-transparent backdrop-blur-sm mb-6">
          <button
            onClick={() => navigate("/clubs")}
            className="flex items-center text-blue-400 hover:text-amber-400 transition-colors duration-300 group"
          >
            <FiArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
            Back to Clubs
          </button>
          {/* Admin Delete Button */}
          {isAdmin && (
            <div className="flex space-x-3">
              {showDeleteConfirm ? (
                <button
                  onClick={handleDeleteClub}
                  className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg font-medium text-sm shadow-md hover:brightness-110 transition-all duration-300 flex items-center animate-pulse"
                >
                  {" "}
                  <FiTrash2 className="mr-1" /> Confirm Delete{" "}
                </button>
              ) : (
                <button
                  onClick={handleDeleteClub}
                  className="px-3 py-2 bg-gray-800/30 hover:bg-red-900/50 text-red-400 hover:text-white rounded-lg font-medium text-sm shadow-md transition-all duration-300 flex items-center border border-gray-700 hover:border-red-700"
                  title={`Delete ${currentClub.name}`}
                >
                  {" "}
                  <FiTrash2 />{" "}
                </button>
              )}
            </div>
          )}
        </div>

        {/* --- Main Club Content Area --- */}
        <div className="container mx-auto px-4">
          <motion.div
            key={currentClub.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-10 md:space-y-16"
          >
            {/* Club Details Section */}
            <Suspense fallback={<LoadingSpinner />}>
              <ClubDetails
                club={currentClub} // Pass the currently available data
                isAdmin={isAdmin}
                isCoordinator={isCurrentUserCoordinator}
                themeStyles={themeStyles}
                onEditClick={() => openModal("club", "edit", currentClub)}
              />
            </Suspense>
            {/* Coordinator List Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`${themeStyles.cardBg} rounded-xl p-6 border ${themeStyles.borderColor}`}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <CoordinatorList
                  isAdmin={isAdmin}
                  isCoordinator={isCurrentUserCoordinator}
                  openModal={openModal}
                  clubId={currentClub.id}
                  themeStyles={themeStyles}
                />
              </Suspense>
            </motion.div>
            {/* Separator */}
            <hr className="border-t border-gray-700/50 my-8 md:my-12" />
            {/* Event List Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`${themeStyles.cardBg} rounded-xl p-6 border ${themeStyles.borderColor}`}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <EventList
                  isAdmin={isAdmin}
                  isCoordinator={isCurrentUserCoordinator}
                  openModal={openModal}
                  handleEventClick={handleEventClick}
                  clubId={currentClub.id}
                  themeStyles={themeStyles}
                />
              </Suspense>
            </motion.div>
          </motion.div>
        </div>

        {/* --- Modals --- */}
        {modalState.isOpen && (
          <Suspense fallback={null}>
            {modalState.type === "club" && (
              <ClubFormModal
                isOpen={modalState.isOpen && modalState.type === "club"}
                onClose={closeModal}
                mode={modalState.mode}
                initialData={modalState.data}
                themeStyles={themeStyles}
              />
            )}
            {modalState.type === "coordinator" && (
              <CoordinatorFormModal
                isOpen={modalState.isOpen && modalState.type === "coordinator"}
                onClose={closeModal}
                mode={modalState.mode}
                initialData={modalState.data}
                themeStyles={themeStyles}
              />
            )}
            {modalState.type === "event" && (
              <EventFormModal
                isOpen={modalState.isOpen && modalState.type === "event"}
                onClose={closeModal}
                mode={modalState.mode}
                initialData={modalState.data}
                themeStyles={themeStyles}
              />
            )}
          </Suspense>
        )}
      </div>
    );
  }

  // Condition 2: If data isn't available yet AND we ARE loading (Initial Load)
  if (clubLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35]">
        <LoadingSpinner />
        <p className="text-lg text-gray-300 mt-4">Loading Club Details...</p>
      </div>
    );
  }

  // Condition 3: If data isn't available AND we are NOT loading (Error or Not Found)
  // This will be the final return if the above conditions are false.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/60 p-8 rounded-xl shadow-2xl border border-red-700/50 max-w-lg"
      >
        <FiAlertTriangle className="text-red-400 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-3">
          {clubError ? "Error Loading Club" : "Club Not Found"}
        </h2>
        <p className="text-gray-300 mb-6">
          {clubError ||
            `Could not find details for the requested club (ID: ${clubId}). It might have been deleted or the link is incorrect.`}
        </p>
        <button
          onClick={() => navigate("/clubs")}
          className="px-6 py-2 mr-2 bg-gray-600 text-white rounded-lg font-semibold shadow-lg hover:bg-gray-500 transition-all duration-300"
        >
          {" "}
          Back to Clubs List{" "}
        </button>
        {clubError && (
          <button
            onClick={() => {
              dispatch(clearClubError());
              dispatch(fetchClubById(clubId));
            }}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300"
          >
            {" "}
            Retry{" "}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ClubDetailPage;
