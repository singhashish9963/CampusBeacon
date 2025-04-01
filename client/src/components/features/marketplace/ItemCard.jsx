import React, { useState } from "react";
import {
  FaRupeeSign,
  FaTrash,
  FaShareAlt,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { IoMdCall, IoMdTime, IoMdPricetag } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem } from "../../../slices/buyandsellSlice";

function ItemCard({ item }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        await dispatch(deleteItem(item.id)).unwrap();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
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
      console.error("Error sharing:", error);
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

  // Allow admin to delete any item; otherwise only allow the owner to delete their item.
  const canDelete =
    user?.id === item.userId || (user?.roles && user.roles.includes("admin"));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden"
    >
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Image Container - Match LostItemCard height */}
        <div className="relative group">
          <motion.img
            src={item.image_url}
            alt={item.name}
            className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}

          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 flex space-x-1.5">
            {canDelete && (
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
              className="p-1.5 text-blue-500 hover:text-blue-400 transition-colors rounded-full bg-blue-500/10 hover:bg-blue-500/20"
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

        {/* Content - Match LostItemCard padding and spacing */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex justify-between items-start">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              {item.item_name}
            </h2>
          </div>

          <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed line-clamp-2">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.item_condition === "New"
                  ? "bg-green-500/20 text-green-400"
                  : item.item_condition === "Like New"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {item.item_condition}
            </span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium">
              {item.category}
            </span>
          </div>

          <div className="space-y-2">
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
              <span className="truncate">
                {showContact ? item.owner_contact : "Show Contact"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ItemCard;
