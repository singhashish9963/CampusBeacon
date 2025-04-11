// LostItemCard.jsx

import React, { useState } from "react";
import { IoMdCall, IoMdTime, IoMdPin } from "react-icons/io";
import {
  FaTrash,
  FaShareAlt,
  FaRegHeart,
  FaHeart,
  FaEdit,
  FaExclamationTriangle,
  FaExpand,
  FaRupeeSign,
} from "react-icons/fa";
import { Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { deleteLostItem } from "../../../slices/lostAndFoundSlice";

function LostItemCard({ item, onEdit }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Allow admin to crud any card; otherwise only allow the owner to manage their card
  const isOwner =
    user?.id === item.userId || (user?.roles && user.roles.includes("admin"));

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true); // Indicate loading state
    try {
      await dispatch(deleteLostItem(item.id)).unwrap();
      showNotification("Item deleted successfully", "success");
      setShowDeleteModal(false); // Close modal on success
    } catch (error) {
      console.error("Error deleting item:", error);
      showNotification(
        "Failed to delete item: " +
          (error?.payload || error.message || "Unknown error"),
        "error"
      );
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  };

  const handleEditClick = () => {
    if (onEdit && isOwner) {
      onEdit(item); // Call the function passed from LostAndFound component
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/lost-and-found/item/${item.id}`;
    try {
      if (navigator.share) {
        const shareData = {
          title: `Lost Item: ${item.item_name}`,
          text: `Found: ${item.item_name} at ${item.location_found}. Contact info available.`,
          url: shareUrl,
        };
        await navigator.share(shareData);
      } else {
        throw new Error("Share API not supported");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showNotification("Link copied to clipboard!", "success");
      } catch (copyError) {
        showNotification("Could not copy link or share.", "error");
      }
    }
  };

  const sanitizeDescription = (text) => {
    if (!text) return "No description provided.";
    if (/SELECT|INSERT|UPDATE|DELETE.*FROM/i.test(text)) {
      return "No description available";
    }
    return text;
  };

  const formatDate = (date) => {
    if (!date) return "a while ago";
    try {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleDateString(undefined, options);
    } catch (e) {
      return "Invalid date";
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <AnimatePresence>
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-5 max-w-md w-full shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-500/20 p-3 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-500" size={24} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Delete Item</h3>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{item.item_name}"? This action
                cannot be undone.
              </p>

              <div className="flex gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-lg font-medium transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2 rounded-lg font-medium shadow-lg hover:shadow-red-500/20 transition-all"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 inline" size={16} />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden"
    >
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div
          className="relative group cursor-pointer"
          onClick={() => item.image_url && setShowFullImage(true)}
        >
          {item.image_url ? (
            <>
              <motion.img
                src={item.image_url}
                alt={item.item_name}
                className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-full h-40 sm:h-48 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
              <p className="text-gray-500 text-sm font-medium">
                No image available
              </p>
            </div>
          )}

          {/* Actions Overlay */}
          <div className="absolute top-2 right-2 flex space-x-1.5">
            {isOwner && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEditClick}
                  className="p-1.5 text-yellow-500 hover:text-yellow-400 transition-colors rounded-full bg-yellow-500/10 hover:bg-yellow-500/20"
                  title="Edit Item"
                >
                  <FaEdit size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 text-red-500 hover:text-red-400 transition-colors rounded-full bg-red-500/10 hover:bg-red-500/20"
                  title="Delete Item"
                >
                  <FaTrash size={14} />
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-1.5 text-yellow-500 hover:text-yellow-400 transition-colors rounded-full bg-yellow-500/10 hover:bg-yellow-500/20"
              title="Share Item"
            >
              <FaShareAlt size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 transition-colors rounded-full ${
                isLiked
                  ? "text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20"
                  : "text-gray-400 hover:text-gray-300 bg-gray-500/10 hover:bg-gray-500/20"
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              {isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            </motion.button>
          </div>

          {/* Location Tag */}
          <div className="absolute bottom-2 right-2">
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              className="flex items-center bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg"
            >
              <IoMdPin className="mr-0.5 text-black" size={12} />
              <span className="font-bold text-black text-sm truncate max-w-32">
                {item.location_found}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent line-clamp-1">
              {item.item_name}
            </h2>
          </div>

          <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed line-clamp-2 flex-grow">
            {sanitizeDescription(item.description)}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {item.status && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                {item.status}
              </span>
            )}
            {item.category && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                {item.category}
              </span>
            )}
          </div>

          <div className="space-y-2 mt-auto">
            <div className="flex items-center text-xs text-gray-400">
              <IoMdTime className="mr-1.5 flex-shrink-0" size={14} />
              <span className="truncate">
                Posted {formatDate(item.createdAt)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `tel:${item.owner_contact}`;
              }}
              className="flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
            >
              <IoMdCall size={16} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">{item.owner_contact}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {/* <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setShowFullImage(false)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={item.image_url}
              alt={`Full view of ${item.item_name}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
              aria-label="Close full image view"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence> */}
    </motion.div>
  );
}

export default LostItemCard;
