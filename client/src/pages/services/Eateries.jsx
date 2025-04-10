import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Phone,
  Star,
  X,
  Edit,
  Trash2,
  Plus,
  Search, // Added Search icon
  Loader2, // Added Loader icon
  AlertTriangle, // Added Alert icon
} from "lucide-react";
import { IoFastFoodOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEateries,
  createEatery,
  updateEatery,
  deleteEatery,
  submitRating,
  // Removed setSelectedEatery as it wasn't used here
} from "../../slices/eateriesSlice";
import StarRating from "../../components/eateries/StarRating";
import EateryForm from "../../components/eateries/EateryForm"; // Assuming this path is correct

// Animation Variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  exit: { y: -10, opacity: 0 },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContent = {
  hidden: { scale: 0.95, opacity: 0, y: 10 },
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 10,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const CollegeEateries = () => {
  const dispatch = useDispatch();
  const { eateries, loading, error } = useSelector((state) => state.eateries);
  const { roles } = useSelector((state) => state.auth);
  const isAdmin = useMemo(
    () => Array.isArray(roles) && roles.includes("admin"),
    [roles]
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [ratingModal, setRatingModal] = useState(null); // Store eatery ID
  const [currentRating, setCurrentRating] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEatery, setEditingEatery] = useState(null); // Store full eatery object
  const [confirmDelete, setConfirmDelete] = useState(null); // Store eatery object
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch eateries on mount
  useEffect(() => {
    dispatch(fetchEateries());
  }, [dispatch]);

  // Filter eateries based on search term (Memoized for performance)
  const filteredEateries = useMemo(() => {
    if (!eateries) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return eateries.filter(
      (eatery) =>
        eatery.name?.toLowerCase().includes(lowerSearchTerm) ||
        eatery.location?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [eateries, searchTerm]);

  // Handlers
  const handleSubmitRating = () => {
    if (!ratingModal) return;
    dispatch(submitRating({ eateryId: ratingModal, rating: currentRating }));
    setRatingModal(null);
    setCurrentRating(0);
  };

  const handleFormSubmit = async (formData, menuImage) => {
    try {
      if (editingEatery) {
        await dispatch(
          updateEatery({
            id: editingEatery.id,
            eateryData: formData,
            menuImage,
          })
        ).unwrap(); // unwrap to catch potential errors
        setEditingEatery(null);
      } else {
        await dispatch(
          createEatery({ eateryData: formData, menuImage })
        ).unwrap();
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save eatery:", err);
      // Optionally show an error toast to the user
    }
  };

  const handleEdit = (eatery) => {
    setEditingEatery(eatery);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      await dispatch(deleteEatery(confirmDelete.id)).unwrap();
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete eatery:", err);
      // Optionally show an error toast to the user
      setConfirmDelete(null); // Close modal even on error
    }
  };

  const openImageModal = (images) => images?.length && setSelectedImage(images);
  const openMenuModal = (menuUrl) => menuUrl && setSelectedMenu(menuUrl);
  const openRatingModal = (eateryId) => eateryId && setRatingModal(eateryId);
  const openDeleteModal = (eatery) => eatery && setConfirmDelete(eatery);
  const openAddForm = () => {
    setEditingEatery(null);
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEatery(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-gray-200 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* --- Header Section (Modified) --- */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Title Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center sm:text-left"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-center sm:justify-start">
                <IoFastFoodOutline className="mr-3 h-8 w-8" /> Campus Eateries
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Discover dining options at MNNIT
              </p>
            </motion.div>

            {/* Controls Area */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center sm:justify-end w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/30 border border-purple-600/30 rounded-full py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition w-full sm:w-64 text-sm backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openAddForm}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white py-2 px-5 rounded-full transition shadow-md hover:shadow-lg text-sm font-medium flex items-center"
                >
                  <Plus size={18} className="mr-1.5" /> Add New
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* --- Content Area --- */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <span className="ml-4 text-xl text-gray-400">
              Loading Eateries...
            </span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-xl text-red-400 mb-2">Failed to load eateries</p>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => dispatch(fetchEateries())}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-full transition text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && eateries && (
          <motion.div
            key={searchTerm} // Re-trigger animation on filter change
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit" // Add exit prop if needed elsewhere
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredEateries.map((eatery) => (
              <motion.div
                key={eatery.id}
                variants={item}
                layoutId={`card-${eatery.id}`} // For potential future animated modal opening
                className="bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-md rounded-xl overflow-hidden border border-purple-800/50 relative shadow-lg transition-all duration-300 hover:border-purple-600/80 hover:shadow-purple-500/10 group"
              >
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(99, 102, 241, 0.9)",
                      }} // Indigo color
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(eatery)}
                      aria-label="Edit Eatery"
                      className="bg-indigo-600/70 p-1.5 rounded-full text-white transition-colors"
                    >
                      <Edit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                      }} // Red color
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openDeleteModal(eatery)}
                      aria-label="Delete Eatery"
                      className="bg-red-600/70 p-1.5 rounded-full text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                )}

                {/* Image/Placeholder */}
                <div
                  className="relative h-48 cursor-pointer overflow-hidden group/image" // group/image for nested hover
                  onClick={() => openImageModal(eatery.images)}
                >
                  {eatery.images?.[0] ? (
                    <img
                      src={eatery.images[0]}
                      alt={`${eatery.name} view`}
                      loading="lazy" // Performance: Lazy load images
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover/image:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <IoFastFoodOutline className="text-gray-600 w-16 h-16 opacity-50" />
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center border border-white/10">
                    <Star className="w-4 h-4 text-yellow-400 mr-1.5" />
                    <span className="text-white text-sm font-semibold">
                      {eatery.averageRating?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                  {/* Open/Closed Badge */}
                  <div
                    className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium border border-black/20 ${
                      eatery.isOpen
                        ? "bg-green-500/80 text-white"
                        : "bg-red-600/80 text-white"
                    }`}
                  >
                    {eatery.isOpen ? "Open Now" : "Closed"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h2
                    className="text-xl font-semibold text-white mb-2 line-clamp-1"
                    title={eatery.name}
                  >
                    {eatery.name}
                  </h2>
                  <div className="space-y-2 mb-4 text-sm flex-grow">
                    <p className="text-gray-400 flex items-start">
                      <MapPin
                        size={15}
                        className="mr-2 mt-0.5 text-purple-400 flex-shrink-0"
                      />
                      <span className="line-clamp-1" title={eatery.location}>
                        {eatery.location}
                      </span>
                    </p>
                    <p className="text-gray-400 flex items-center">
                      <Clock
                        size={15}
                        className="mr-2 text-purple-400 flex-shrink-0"
                      />
                      {eatery.openingTime ?? "N/A"} -{" "}
                      {eatery.closingTime ?? "N/A"}
                    </p>
                    <p className="text-gray-400 flex items-center">
                      <Phone
                        size={15}
                        className="mr-2 text-purple-400 flex-shrink-0"
                      />
                      {eatery.phoneNumber ?? "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openRatingModal(eatery.id)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-3 rounded-md transition shadow-sm text-sm font-medium"
                    >
                      Rate
                    </motion.button>
                    {eatery.menuImageUrl && (
                      <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openMenuModal(eatery.menuImageUrl)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-3 rounded-md transition shadow-sm text-sm font-medium"
                      >
                        Menu
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results Message */}
        {!loading && !error && filteredEateries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <IoFastFoodOutline className="mx-auto h-16 w-16 opacity-50 mb-4" />
            <p className="text-xl mb-2">
              {eateries?.length > 0
                ? "No eateries match your search."
                : "No eateries found."}
            </p>
            {eateries?.length > 0 && searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-purple-400 hover:text-purple-300 hover:underline text-sm"
              >
                Clear search
              </button>
            )}
            {!isAdmin && eateries?.length === 0 && (
              <p className="text-sm mt-2">
                Check back later for new additions!
              </p>
            )}
            {isAdmin && eateries?.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddForm}
                className="mt-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white py-2 px-5 rounded-full transition shadow-md hover:shadow-lg text-sm font-medium flex items-center mx-auto"
              >
                <Plus size={18} className="mr-1.5" /> Add the First Eatery
              </motion.button>
            )}
          </motion.div>
        )}

        {/* --- Modals --- */}
        <AnimatePresence>
          {/* Image Viewer Modal */}
          {selectedImage && (
            <motion.div
              variants={modalOverlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                variants={modalContent}
                className="relative max-w-4xl w-full bg-gray-900/50 p-4 rounded-lg border border-purple-700/50"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <motion.button
                  className="absolute -top-3 -right-3 text-white bg-red-600/80 hover:bg-red-700 p-1.5 rounded-full transition-colors z-10"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close image viewer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[80vh] overflow-y-auto">
                  {selectedImage.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="overflow-hidden rounded-md"
                    >
                      <img
                        src={img}
                        alt={`Eatery view ${index + 1}`}
                        className="w-full h-64 object-cover rounded-md shadow-lg hover:scale-105 transition-transform duration-200"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Menu Viewer Modal */}
          {selectedMenu && (
            <motion.div
              variants={modalOverlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMenu(null)}
            >
              <motion.div
                variants={modalContent}
                className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden bg-gray-900/50 rounded-lg border border-purple-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  className="absolute -top-3 -right-3 text-white bg-red-600/80 hover:bg-red-700 p-1.5 rounded-full transition-colors z-10"
                  onClick={() => setSelectedMenu(null)}
                  aria-label="Close menu viewer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
                <img
                  src={selectedMenu}
                  alt="Menu"
                  className="w-full h-auto object-contain max-h-[85vh] rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Rating Modal */}
          {ratingModal && (
            <motion.div
              variants={modalOverlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setRatingModal(null)} // Allow closing by clicking overlay
            >
              <motion.div
                variants={modalContent}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl max-w-md w-full border border-amber-500/40 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Rate {eateries?.find((e) => e.id === ratingModal)?.name ?? ""}
                </h3>
                <div className="flex justify-center mb-6">
                  <StarRating
                    rating={currentRating}
                    setRating={setCurrentRating}
                    size={32}
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmitRating}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2.5 px-4 rounded-lg transition font-medium text-sm shadow-sm"
                  >
                    Submit Rating
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setRatingModal(null);
                      setCurrentRating(0);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 px-4 rounded-lg transition font-medium text-sm shadow-sm"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add/Edit Form Modal */}
          {isFormOpen && (
            <motion.div
              variants={modalOverlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeForm}
            >
              <motion.div
                variants={modalContent}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl max-w-lg w-full border border-purple-600/40 shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  {editingEatery ? (
                    <>
                      {" "}
                      <Edit size={20} className="mr-2.5 text-indigo-400" /> Edit
                      Eatery{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <Plus size={20} className="mr-2.5 text-green-400" /> Add
                      New Eatery{" "}
                    </>
                  )}
                  <button
                    onClick={closeForm}
                    className="ml-auto text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </h3>
                <EateryForm
                  initialData={editingEatery}
                  onSubmit={handleFormSubmit}
                  onCancel={closeForm}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <motion.div
              variants={modalOverlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setConfirmDelete(null)}
            >
              <motion.div
                variants={modalContent}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl max-w-md w-full border border-red-500/40 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle size={20} className="mr-2.5 text-red-400" />{" "}
                  Confirm Deletion
                </h3>
                <p className="text-gray-300 mb-6 text-sm">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-white">
                    {confirmDelete.name}
                  </span>
                  ?
                  <br />
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-2.5 px-4 rounded-lg transition font-medium text-sm shadow-sm"
                  >
                    Delete Permanently
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 px-4 rounded-lg transition font-medium text-sm shadow-sm"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollegeEateries;
