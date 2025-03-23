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
import { deleteItem } from "../../../slices/buyAndSellSlice";

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={item.image_url}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}

          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 flex space-x-2">
            {user?.id === item.userId && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-2 bg-red-500/20 backdrop-blur-sm rounded-full hover:bg-red-500/40 transition-colors"
                title="Delete Item"
              >
                <FaTrash className="text-red-500" size={16} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-full hover:bg-blue-500/40 transition-colors"
              title="Share Item"
            >
              <FaShareAlt className="text-blue-500" size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                isLiked
                  ? "bg-pink-500/20 hover:bg-pink-500/40"
                  : "bg-gray-500/20 hover:bg-gray-500/40"
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              {isLiked ? (
                <FaHeart className="text-pink-500" size={16} />
              ) : (
                <FaRegHeart className="text-gray-400" size={16} />
              )}
            </motion.button>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2">
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              className="flex items-center bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg"
            >
              <FaRupeeSign className="mr-1 text-white" size={14} />
              <span className="font-bold text-white">{item.price}</span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {item.item_name}
            </h2>
            <p className="text-gray-300 line-clamp-2">{item.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                item.item_condition === "New"
                  ? "bg-green-500/20 text-green-400"
                  : item.item_condition === "Like New"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {item.item_condition}
            </span>
            <span className="text-sm bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-medium">
              {item.category}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-400">
            <IoMdTime className="mr-1" />
            <span>Posted {formatDate(item.createdAt)}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowContact(!showContact)}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium px-4 py-3 rounded-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          >
            <div className="flex items-center justify-center">
              <IoMdCall size={20} className="mr-2" />
              {showContact ? item.owner_contact : "Show Contact"}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ItemCard;
