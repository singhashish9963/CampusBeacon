import React from "react";
import { motion } from "framer-motion";
import { Users, IndianRupee, Phone, Edit, Trash2, User } from "lucide-react";
import { formatDateTime, isRideActive } from "../../utils/dateUtils";

const RideCard = ({
  ride,
  onEdit,
  onDelete,
  currentUser,
  onJoin,
  onUnjoin,
}) => {
  const isCreator = ride.creatorId === currentUser?.id;
  // Determine if the current user has joined the ride
  const hasJoined = ride.participants?.some((p) => p.id === currentUser?.id);

  if (!ride) {
    return <div className="p-6 text-red-500">Invalid ride data</div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {ride.pickupLocation} &rarr; {ride.dropLocation}
          </h2>
          <p className="text-gray-400">
            {formatDateTime(ride.departureDateTime)}
          </p>
          <div className="flex items-center mt-2 text-gray-400">
            <User className="w-4 h-4 mr-2" />
            <span>
              Posted by:{" "}
              {ride.creator?.name || ride.creator?.email || "Anonymous"}
            </span>
          </div>
        </div>
        {isCreator && (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(ride)}
              className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
              aria-label="Edit ride"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(ride.id)}
              className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
              aria-label="Delete ride"
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
            <span>{ride.estimatedCost || "Free"}</span>
          </div>
        </div>

        {ride.phoneNumber && (
          <p className="text-gray-300 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-purple-400" />{" "}
            {ride.phoneNumber}
          </p>
        )}

        {ride.description && (
          <p className="text-gray-300 text-sm italic">"{ride.description}"</p>
        )}

        {/* Participants Section */}
        {ride.participants && ride.participants.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-400 mb-2">Participants:</p>
            <div className="flex flex-wrap gap-2">
              {ride.participants.map((participant) => (
                <span
                  key={participant.id}
                  className="bg-purple-500/20 text-purple-200 text-sm px-3 py-1 rounded-full"
                >
                  {participant.name || participant.email}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Display Join or Cancel Join button if the ride is active and the user is not its creator */}
      {!isCreator && isRideActive(ride.departureDateTime) && (
        <>
          {hasJoined ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onUnjoin(ride.id)}
              className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center"
            >
              Cancel Join
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onJoin(ride.id)}
              disabled={ride.availableSeats === 0}
              className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center ${
                ride.availableSeats === 0
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {ride.availableSeats === 0 ? "Full" : "Join Ride"}
            </motion.button>
          )}
        </>
      )}

      {isCreator && (
        <div className="mt-4 text-center text-gray-400 bg-purple-500/10 py-2 rounded-lg">
          Your Ride Offering
        </div>
      )}
    </div>
  );
};

export default RideCard;
