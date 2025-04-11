import React, { useState } from "react";
import {
  FaRupeeSign,
  FaTrash,
  FaShareAlt,
  FaRegHeart,
  FaHeart,
  FaEdit,
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

  // Check if current user is the owner or admin
  const isOwner = user?.id === item.userId;
  const isAdmin = user?.roles && user.roles.includes("admin");
  const canModify = isOwner || isAdmin;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        await dispatch(deleteItem(item.id)).unwrap();
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden"
    >
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
          {item.image_url && (
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
          )}

          {/* Actions Overlay */}
          <div className="absolute top-2 right-2 flex space-x-1.5">
            {canModify && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEdit}
                  className="p-1.5 text-blue-500 hover:text-blue-400 transition-colors rounded-full bg-blue-500/10 hover:bg-blue-500/20"
                  title="Edit Item"
                >
                  <FaEdit size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
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
              className="p-1.5 text-indigo-500 hover:text-indigo-400 transition-colors rounded-full bg-indigo-500/10 hover:bg-indigo-500/20"
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
                  ? "text-pink-500 hover:text-pink-400 bg-pink-500/10 hover:bg-pink-500/20"
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
              className="flex items-center bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg"
            >
              <FaRupeeSign className="mr-0.5 text-white" size={12} />
              <span className="font-bold text-white text-sm">{item.price}</span>
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
                    ? "bg-blue-500/20 text-blue-400"
                    : item.item_condition === "Good"
                    ? "bg-teal-500/20 text-teal-400"
                    : item.item_condition === "Fair"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.item_condition}
              </span>
            )}
            {item.category && (
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium">
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
              className="w-full py-1.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <IoMdCall className="mr-1.5" size={16} />
              {showContact ? "Hide Contact" : "Show Contact"}
            </motion.button>

            <AnimatePresence>
              {showContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-indigo-900/30 rounded-lg p-2 text-center">
                    <p className="text-indigo-200 text-sm break-all">
                      {item.owner_contact || "No contact info provided"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ItemCard;
