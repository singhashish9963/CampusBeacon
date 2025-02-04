import React from "react";
import { IoMdCall } from "react-icons/io";
import { motion } from "framer-motion";


{/* 
  ===========================================
  Re-useable Item Card for Lost & Found Page 
  ===========================================
*/}

import { FaTrash } from "react-icons/fa";
import { useLostAndFound } from "../contexts/lostandfoundContext";
import { useAuth } from "../contexts/AuthContext";

function LostItemCard({ item }) {
  const { deleteItem } = useLostAndFound();
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


  const isOwner = user?.id === item.userId;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-1">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-lg p-5 space-y-4 hover:scale-105 transition-all"
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">{item.item_name}</h2>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                title="Delete Item"
              >
                <FaTrash size={18} />
              </button>
            )}
          </div>

          <p className="text-gray-300">{item.description}</p>
          <p className="text-gray-300">Location: {item.location_found}</p>

          <button className="flex items-center justify-center bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors w-full">
            <IoMdCall size={24} className="mr-2" />
            Contact: {item.owner_contact}
          </button>

          <p className="text-sm text-gray-400">
            Posted: {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LostItemCard;
