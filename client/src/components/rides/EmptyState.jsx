import React from "react";
import { motion } from "framer-motion";
import { Car, Plus } from "lucide-react";

const EmptyState = ({ activeFilterCount, onOfferRide, onClearFilters }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black/30 backdrop-blur-md rounded-xl border border-purple-500/30 text-center p-10 mt-8"
    >
      <Car className="w-12 h-12 mx-auto text-gray-500 mb-4" />
      <div className="text-gray-300 text-xl font-medium mb-3">
        {activeFilterCount > 0
          ? "No rides found matching your filters"
          : "No rides available"}
      </div>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {activeFilterCount > 0
          ? "Try adjusting your search criteria or clearing filters"
          : "Be the first to offer a ride and help connect the campus community!"}
      </p>
      {activeFilterCount > 0 ? (
        <button
          onClick={onClearFilters}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition-colors"
        >
          Clear all filters
        </button>
      ) : (
        <button
          onClick={onOfferRide}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-colors flex items-center mx-auto"
        >
          <Plus className="mr-2" /> Offer a Ride
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
