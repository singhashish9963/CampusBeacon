import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { IoFastFoodOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEateries,
  createEatery,
  updateEatery,
  deleteEatery,
  submitRating,
  setSelectedEatery,
} from "../../slices/eateriesSlice";
import StarRating from "../../components/eateries/StarRating";
import EateryForm from "../../components/eateries/EateryForm";

const CollegeEateries = () => {
  const dispatch = useDispatch();
  const { eateries, loading, error } = useSelector((state) => state.eateries);
  // Get authentication data (including roles) from the auth slice.
  // Here we check if roles is an array, similar to how it's done in ContactsDisplay.
  const { roles } = useSelector((state) => state.auth);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEatery, setEditingEatery] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEateries, setFilteredEateries] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  // Fetch eateries on mount
  useEffect(() => {
    dispatch(fetchEateries());
  }, [dispatch]);

  // Filter eateries based on search term
  useEffect(() => {
    if (eateries) {
      setFilteredEateries(
        eateries.filter(
          (eatery) =>
            eatery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eatery.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [eateries, searchTerm]);

  const handleSubmitRating = (eateryId) => {
    dispatch(submitRating({ eateryId, rating: currentRating }));
    setRatingModal(null);
    setCurrentRating(0);
  };

  const handleFormSubmit = async (formData, menuImage) => {
    if (editingEatery) {
      await dispatch(
        updateEatery({ id: editingEatery.id, eateryData: formData, menuImage })
      ).unwrap();
      setEditingEatery(null);
    } else {
      await dispatch(
        createEatery({ eateryData: formData, menuImage })
      ).unwrap();
    }
    setIsFormOpen(false);
  };

  const handleEdit = (eatery) => {
    setEditingEatery(eatery);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteEatery(id));
    setConfirmDelete(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="sticky top-0 z-30 bg-black/50 backdrop-blur-md py-4 -mx-8 px-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white flex items-center"
            >
              <IoFastFoodOutline className="mr-3" /> MNNIT Eateries
            </motion.h1>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search eateries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/40 border border-purple-500/50 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10 w-full md:w-64"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
              {/* Only allow admin users to see the Add Eatery button */}
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingEatery(null);
                    setIsFormOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <Plus className="mr-2" /> Add Eatery
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredEateries.map((eatery) => (
            <motion.div
              key={eatery.id}
              variants={item}
              layoutId={`card-${eatery.id}`}
              whileHover={expandedCard ? {} : { scale: 1.02, y: -5 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border-2 border-purple-500/50 relative"
            >
              {/* Only allow admin users to see the edit and delete buttons */}
              {isAdmin && (
                <div className="absolute top-3 right-3 z-10 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(eatery)}
                    className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmDelete(eatery.id)}
                    className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
              <div
                className="relative h-48 cursor-pointer overflow-hidden"
                onClick={() => {
                  if (eatery.images?.length) {
                    setSelectedImage(eatery.images);
                  } else if (eatery.menuImageUrl) {
                    setSelectedMenu(eatery.menuImageUrl);
                  }
                }}
              >
                {eatery.images?.length > 0 || eatery.menuImageUrl ? (
                  <img
                    src={eatery.images?.[0] || eatery.menuImageUrl}
                    alt={eatery.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <IoFastFoodOutline className="text-gray-500 w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-white text-lg">
                    {eatery.averageRating?.toFixed(1) || "N/A"}
                  </span>
                </div>
                {eatery.isOpen && (
                  <div className="absolute bottom-4 left-4 bg-green-500/70 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">
                      Open Now
                    </span>
                  </div>
                )}
                {!eatery.isOpen && (
                  <div className="absolute bottom-4 left-4 bg-red-500/70 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">
                      Closed
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                  {eatery.name}
                </h2>
                <div className="space-y-3 mb-4">
                  <p className="text-gray-300 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />{" "}
                    {eatery.location}
                  </p>
                  <p className="text-gray-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />{" "}
                    {eatery.openingTime || "N/A"} -{" "}
                    {eatery.closingTime || "N/A"}
                  </p>
                  <p className="text-gray-300 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-purple-400" />{" "}
                    {eatery.phoneNumber || "N/A"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRatingModal(eatery.id)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Rate
                  </motion.button>
                  {eatery.menuImageUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMenu(eatery.menuImageUrl)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Menu
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredEateries.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-xl">
              {searchTerm
                ? "No eateries found matching your search"
                : "No eateries available. Add one to get started!"}
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-purple-400 hover:text-purple-300 underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl w-full">
                <motion.button
                  className="absolute -top-12 right-0 text-white bg-red-500/50 hover:bg-red-500 p-2 rounded-full transition-colors"
                  onClick={() => setSelectedImage(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedImage.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={img}
                        alt="Canteen View"
                        className="w-full h-64 object-cover rounded-lg shadow-2xl"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMenu(null)}
            >
              <div className="relative max-w-2xl w-full">
                <motion.button
                  className="absolute -top-12 right-0 text-white bg-red-500/50 hover:bg-red-500 p-2 rounded-full transition-colors"
                  onClick={() => setSelectedMenu(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
                <motion.img
                  src={selectedMenu}
                  alt="Menu"
                  className="w-full rounded-lg shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                />
              </div>
            </motion.div>
          )}

          {ratingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 p-8 rounded-xl max-w-md w-full border-2 border-amber-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Rate {eateries.find((e) => e.id === ratingModal)?.name || ""}
                </h3>
                <div className="flex justify-center mb-6">
                  <StarRating
                    rating={currentRating}
                    setRating={setCurrentRating}
                  />
                </div>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubmitRating(ratingModal)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setRatingModal(null);
                      setCurrentRating(0);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setIsFormOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 p-8 rounded-xl max-w-lg w-full border-2 border-purple-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  {editingEatery ? (
                    <>
                      <Edit className="mr-3 text-purple-400" /> Edit Eatery
                    </>
                  ) : (
                    <>
                      <Plus className="mr-3 text-green-400" /> Add New Eatery
                    </>
                  )}
                </h3>
                <EateryForm
                  initialData={editingEatery}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingEatery(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setConfirmDelete(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 p-8 rounded-xl max-w-md w-full border-2 border-red-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Trash2 className="mr-3 text-red-400" /> Confirm Deletion
                </h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {eateries.find((e) => e.id === confirmDelete)?.name}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(confirmDelete)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
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
