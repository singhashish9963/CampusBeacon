import React, { useState } from "react";
import {
  FaRupeeSign,
  FaTrash,
  FaShareAlt,
  FaRegHeart,
  FaHeart,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoMdCall, IoMdTime } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem } from "../../../slices/buyandsellSlice";

function ItemCard({ item, onEdit }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if current user is the owner or admin
  const isOwner = user?.id === item.userId;
  const isAdmin = user?.roles && user.roles.includes("admin");
  const canModify = isOwner || isAdmin;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteItem(item.id)).unwrap();
      showNotification("Item deleted successfully", "success");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      showNotification(
        "Failed to delete item: " + (error.message || "Unknown error"),
        "error"
      );
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    if (onEdit && canModify) {
      onEdit(item);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: item.item_name,
        text: `Check out this ${item.item_name} for ₹${item.price}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      showNotification("Link copied to clipboard!", "success");
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Function to sanitize description text
  const sanitizeDescription = (text) => {
    if (!text) return "";
    // Check if the text looks like an SQL query
    if (/SELECT|INSERT|UPDATE|DELETE.*FROM/i.test(text)) {
      return "No description available";
    }
    return text;
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
          onClick={handleDeleteCancel}
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
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2 rounded-lg font-medium shadow-lg hover:shadow-red-500/20 transition-all"
                >
                  Delete
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
        <div className="relative group">
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
            {canModify && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEdit}
                  className="p-1.5 text-yellow-500 hover:text-yellow-400 transition-colors rounded-full bg-yellow-500/10 hover:bg-yellow-500/20"
                  title="Edit Item"
                >
                  <FaEdit size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDeleteClick}
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

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2">
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              className="flex items-center bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg"
            >
              <FaRupeeSign className="mr-0.5 text-black" size={12} />
              <span className="font-bold text-black text-sm">{item.price}</span>
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
            {item.item_condition && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.item_condition === "New"
                    ? "bg-green-500/20 text-green-400"
                    : item.item_condition === "Like New"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : item.item_condition === "Good"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : item.item_condition === "Fair"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.item_condition}
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
              onClick={() => setShowContact(!showContact)}
              className="flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
            >
              <IoMdCall size={16} className="mr-1.5 flex-shrink-0" />
              {showContact ? (
                <span className="truncate">
                  {item.owner_contact || "No contact info provided"}
                </span>
              ) : (
                <span>Show Contact</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ItemCard;
