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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 p-4 sm:p-6 rounded-xl w-full max-w-md md:max-w-lg border-2 border-purple-500/30 shadow-xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
          {editingRide ? (
            <>
              <Edit className="mr-2 h-5 w-5 text-purple-400" />
              <span className="truncate">Edit Ride</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5 text-green-400" />
              <span className="truncate">Offer New Ride</span>
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
