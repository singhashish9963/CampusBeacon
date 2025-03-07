import React from "react";
import { motion } from "framer-motion";
import { Users, IndianRupee, Phone, Edit, Trash2 } from "lucide-react";
import { formatDateTime, isRideActive } from "../../utils/dateUtils";

const RideCard = ({ ride, onEdit, onDelete, currentUser }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {ride.pickupLocation} → {ride.dropLocation}
          </h2>
          <p className="text-gray-400">
            {formatDateTime(ride.departureDateTime)}
          </p>
        </div>

        {ride.creatorId === currentUser?.id && (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(ride)}
              className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(ride.id)}
              className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-gray-300">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-purple-400" />
            <span>
              {ride.availableSeats}/{ride.totalSeats} seats available
            </span>
          </div>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 mr-1 text-green-400" />
            <span>{ride.estimatedCost}</span>
          </div>
        </div>

        {ride.phoneNumber && (
          <p className="text-gray-300 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-purple-400" />
            {ride.phoneNumber}
          </p>
        )}

        {ride.description && (
          <p className="text-gray-300 text-sm italic">"{ride.description}"</p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center
          ${
            isRideActive(ride.departureDateTime)
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-600 cursor-not-allowed text-gray-300"
          }`}
        disabled={!isRideActive(ride.departureDateTime)}
      >
        {isRideActive(ride.departureDateTime) ? "Join Ride" : "Ride Completed"}
      </motion.button>
    </div>
  );
};

export default RideCard;
