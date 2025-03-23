import React from "react";
import { motion } from "framer-motion";
import { Plus, Edit } from "lucide-react";
import RideForm from "./RideForm";

const RideFormModal = ({ isOpen, editingRide, onSubmit, onCancel }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 p-6 sm:p-8 rounded-xl max-w-lg w-full border-2 border-purple-500/30 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          {editingRide ? (
            <>
              <Edit className="mr-3 text-purple-400" /> Edit Ride
            </>
          ) : (
            <>
              <Plus className="mr-3 text-green-400" /> Offer New Ride
            </>
          )}
        </h3>
        <RideForm
          initialData={editingRide}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </motion.div>
    </motion.div>
  );
};

export default RideFormModal;
