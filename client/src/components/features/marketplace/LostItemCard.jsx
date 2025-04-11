import React, { useState } from "react";
import { IoMdCall, IoMdTime, IoMdPin } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaShare, FaExpand } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteLostItem } from "../../../slices/lostAndFoundSlice";

function LostItemCard({ item }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        await dispatch(deleteLostItem(item.id)).unwrap();
        showNotification("Item deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showNotification(
        "Failed to delete item: " + (error.message || "Unknown error"),
        "error"
      );
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: `Lost Item: ${item.item_name}`,
        text: `Found at ${item.location_found}. Contact: ${item.owner_contact}`,
        url: window.location.href,
      };
      await navigator.share(shareData);
    } catch (error) {
      console.error("Error sharing:", error);
      // Use notification instead of browser alert
      navigator.clipboard.writeText(window.location.href);
      showNotification("Link copied to clipboard!", "success");
    }
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

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Allow admin to crud any card; otherwise only allow the owner to manage their card
  const isOwner =
    user?.id === item.userId || (user?.roles && user.roles.includes("admin"));

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
          {/* Image Section */}
          <div className="relative group">
            {item.image_url ? (
              <>
                <img
                  src={item.image_url}
                  alt={item.item_name}
                  className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setShowFullImage(true)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FaExpand className="text-white text-xl" />
                </div>
              </>
            ) : (
              <div className="w-full h-40 sm:h-48 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                <p className="text-gray-500 text-sm font-medium">
                  No image available
                </p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex justify-between items-start">
              <motion.h2
                className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent"
                layout
              >
                {item.item_name}
              </motion.h2>
              <div className="flex space-x-1 sm:space-x-2">
                {isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="p-1.5 text-red-500 hover:text-red-400 transition-colors rounded-full bg-red-500/10 hover:bg-red-500/20"
                    title="Delete Item"
                  >
                    <FaTrash size={14} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-1.5 text-yellow-500 hover:text-yellow-400 transition-colors rounded-full bg-yellow-500/10 hover:bg-yellow-500/20"
                  title="Share Item"
                >
                  <FaShare size={14} />
                </motion.button>
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed line-clamp-2">
              {item.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center text-gray-400 text-sm">
                <IoMdPin
                  className="mr-1.5 text-yellow-500 flex-shrink-0"
                  size={16}
                />
                <span className="truncate">{item.location_found}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
              >
                <IoMdCall size={16} className="mr-1.5 flex-shrink-0" />
                <span className="truncate">{item.owner_contact}</span>
              </motion.button>

              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <IoMdTime className="mr-1 flex-shrink-0" size={14} />
                  <span className="truncate">
                    Posted: {formatDate(item.createdAt)}
                  </span>
                </div>
                {item.status && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowFullImage(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={item.image_url}
              alt={item.item_name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LostItemCard;
