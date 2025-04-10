import React from "react";
import { motion } from "framer-motion";
import { Car, Plus } from "lucide-react";

const RideHeader = ({ onOfferRide }) => {
  return (
    <div className="mb-8 pt-4 pb-5 border-b border-purple-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 text-transparent bg-clip-text flex items-center">
            <Car className="mr-3 text-purple-400 h-8 w-8" />
            MNNIT Ride Sharing
          </h1>
          <p className="text-gray-400 mt-1 ml-11 text-sm">
            Find or offer rides within campus
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOfferRide}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-5 rounded-full transition-all flex items-center shadow-lg shadow-purple-900/30 self-start sm:self-center"
        >
          <Plus className="mr-2 h-5 w-5" /> Offer Ride
        </motion.button>
      </div>
    </div>
  );
};

export default RideHeader;
