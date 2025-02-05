import React from "react";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { motion } from "framer-motion";
import { useBuyAndSell } from "../contexts/buyandsellContext";
import { useAuth } from "../contexts/AuthContext"; 


{/* 
  =========================================
  Re-useable Item Card for Buy & Sell Page 
  =========================================
*/}

function ItemCard({ item }) {
  const { deleteItem } = useBuyAndSell();
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        await deleteItem(item.id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-1">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-lg p-5 space-y-4 hover:scale-105 transition-all relative"
      >
        {user?.id === item.userId && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-colors"
            title="Delete Item"
          >
            <FaTrash className="text-red-500" size={16} />
          </button>
        )}

        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mr-2">{item.item_name}</h2>
            <h2 className="text-green-400 font-semibold flex items-center">
              <FaRupeeSign className="mr-1" />
              {item.price}
            </h2>
          </div>
          <p className="text-gray-300">{item.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm bg-blue-600 px-3 py-1 rounded-full">
              {item.item_condition}
            </span>
          </div>
          <button className="flex items-center justify-center bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
            <IoMdCall size={24} className="mr-2" /> Contact: {item.owner_contact}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ItemCard;