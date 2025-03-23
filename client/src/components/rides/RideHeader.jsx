import React from "react";
import { motion } from "framer-motion";
import { Car, Plus } from "lucide-react";

const RideHeader = ({ onOfferRide }) => {
  return (
    <div className="sticky top-0 z-30 bg-black/50 backdrop-blur-md py-4 -mx-4 sm:-mx-8 px-4 sm:px-8 mb-8 border-b border-purple-500/30">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white flex items-center"
        >
          <Car className="mr-3" /> MNNIT Ride Share
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOfferRide}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center shadow-lg shadow-green-900/20"
        >
          <Plus className="mr-2" /> Offer Ride
        </motion.button>
      </div>
    </div>
  );
};

export default RideHeader;
