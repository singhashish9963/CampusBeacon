import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  IndianRupee,
  Phone,
  Edit,
  Trash2,
  User,
  Loader2,
  Eye,
} from "lucide-react";
import { formatDateTime, isRideActive } from "../../utils/dateUtils";
import { useSelector } from "react-redux";
import ParticipantsModal from "./ParticipantsModal";

const RideCard = ({
  ride,
  onEdit,
  onDelete,
  currentUser,
  onJoin,
  onUnjoin,
  isLoading,
}) => {
  const { roles } = useSelector((state) => state.auth);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");
  const isCreator = ride.creatorId === currentUser?.id;
  const hasJoined = ride.participants?.some(
    (p) => p.participant?.id === currentUser?.id
  );

  const [showParticipants, setShowParticipants] = useState(false);

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
        <div className="flex space-x-2">
          {ride.participants && ride.participants.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowParticipants(true)}
              className="bg-purple-500 p-2 rounded-full text-white hover:bg-purple-600 transition-colors"
              aria-label="View participants"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          )}
          {(isCreator || isAdmin) && (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
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

        {ride.participants && ride.participants.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-400 mb-2">Participants:</p>
            <div className="flex flex-wrap gap-2">
              {ride.participants.slice(0, 3).map((participant) => (
                <span
                  key={participant.id}
                  className="bg-purple-500/20 text-purple-200 text-sm px-3 py-1 rounded-full"
                >
                  {participant.participant?.name ||
                    participant.participant?.email}
                </span>
              ))}
              {ride.participants.length > 3 && (
                <span className="bg-purple-500/20 text-purple-200 text-sm px-3 py-1 rounded-full">
                  +{ride.participants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!isCreator && isRideActive(ride.departureDateTime) && (
        <div className="mt-4">
          {hasJoined ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onUnjoin(ride.id)}
              disabled={isLoading}
              className={`w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Join"
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onJoin(ride.id)}
              disabled={ride.availableSeats === 0 || isLoading}
              className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center ${
                ride.availableSeats === 0 || isLoading
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : ride.availableSeats === 0 ? (
                "Full"
              ) : (
                "Join Ride"
              )}
            </motion.button>
          )}
        </div>
      )}

      {isCreator && (
        <div className="mt-4 text-center text-gray-400 bg-purple-500/10 py-2 rounded-lg">
          Your Ride Offering
        </div>
      )}

      <ParticipantsModal
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        participants={ride.participants || []}
        rideDetails={ride}
      />
    </div>
  );
};

export default RideCard;
