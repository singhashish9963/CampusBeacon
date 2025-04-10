import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  IndianRupee,
  Phone,
  Edit,
  Trash2,
  User,
  Loader2,
  Eye,
  MapPin,
  Calendar,
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
  const [isHovered, setIsHovered] = useState(false);

  if (!ride) {
    return <div className="p-6 text-red-500">Invalid ride data</div>;
  }

  const isActive = isRideActive(ride.departureDateTime);
  const cardStatusClass = isCreator
    ? "border-l-4 border-purple-500"
    : !isActive
    ? "border-l-4 border-gray-500"
    : ride.availableSeats === 0
    ? "border-l-4 border-red-500"
    : "border-l-4 border-green-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -15px rgba(138, 75, 235, 0.3)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg ${cardStatusClass} overflow-hidden relative`}
    >
      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_15%_50%,rgba(138,75,235,0.8),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.8),transparent_30%)]"></div>

      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.h2
              layout
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 mb-1"
            >
              {ride.pickupLocation} &rarr; {ride.dropLocation}
            </motion.h2>
            <div className="flex items-center text-gray-400 mb-1">
              <Calendar className="w-4 h-4 mr-2 text-blue-400" />
              <span>{formatDateTime(ride.departureDateTime)}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <User className="w-4 h-4 mr-2 text-purple-400" />
              <span>
                {ride.creator?.name || ride.creator?.email || "Anonymous"}
              </span>
            </div>
          </div>

          <AnimatePresence>
            <div className="flex space-x-2">
              {ride.participants && ride.participants.length > 0 && (
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, backgroundColor: "#9061F9" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowParticipants(true)}
                  className="bg-purple-600 p-2 rounded-full text-white transition-all shadow-md"
                  aria-label="View participants"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
              )}
              {(isCreator || isAdmin) && (
                <>
                  <motion.button
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(ride)}
                    className="bg-blue-600 p-2 rounded-full text-white transition-all shadow-md"
                    aria-label="Edit ride"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, backgroundColor: "#EF4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(ride.id)}
                    className="bg-red-600 p-2 rounded-full text-white transition-all shadow-md"
                    aria-label="Delete ride"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </div>
          </AnimatePresence>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-300">
            <motion.div
              className="flex items-center bg-purple-500/10 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-4 h-4 mr-2 text-purple-400" />
              <span>
                {ride.availableSeats}/{ride.totalSeats} seats
              </span>
            </motion.div>
            <motion.div
              className="flex items-center bg-green-500/10 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <IndianRupee className="w-4 h-4 mr-1 text-green-400" />
              <span>{ride.estimatedCost || "Free"}</span>
            </motion.div>
          </div>

          {ride.phoneNumber && (
            <motion.div
              className="text-gray-300 flex items-center"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, x: 5 }}
            >
              <Phone className="w-4 h-4 mr-2 text-blue-400" />{" "}
              {ride.phoneNumber}
            </motion.div>
          )}

          {ride.description && (
            <motion.div
              className="bg-gray-800/50 p-3 rounded-lg mt-2 text-gray-300 text-sm italic border-l-2 border-purple-500/50"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              "{ride.description}"
            </motion.div>
          )}

          {ride.participants && ride.participants.length > 0 && (
            <motion.div
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="mt-3"
            >
              <p className="text-gray-400 mb-2 text-sm">Participants:</p>
              <div className="flex flex-wrap gap-2">
                {ride.participants.slice(0, 3).map((participant) => (
                  <span
                    key={participant.id}
                    className="bg-blue-500/20 text-blue-200 text-xs px-3 py-1 rounded-full"
                  >
                    {participant.participant?.name ||
                      participant.participant?.email}
                  </span>
                ))}
                {ride.participants.length > 3 && (
                  <span className="bg-purple-500/20 text-purple-200 text-xs px-3 py-1 rounded-full">
                    +{ride.participants.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Button */}
        {!isCreator && isActive && (
          <div className="mt-4">
            {hasJoined ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onUnjoin(ride.id)}
                disabled={isLoading}
                className={`w-full py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-red-500 text-white transition-all ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </div>
                ) : (
                  "Cancel Join"
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onJoin(ride.id)}
                disabled={ride.availableSeats === 0 || isLoading}
                className={`w-full py-2 rounded-lg shadow-lg transition-all ${
                  ride.availableSeats === 0 || isLoading
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </div>
                ) : ride.availableSeats === 0 ? (
                  "No Seats Available"
                ) : (
                  "Join Ride"
                )}
              </motion.button>
            )}
          </div>
        )}

        {isCreator && (
          <motion.div
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.02 }}
            className="mt-4 text-center text-white font-medium bg-gradient-to-r from-purple-600/30 to-blue-600/30 py-2 rounded-lg border border-purple-500/20"
          >
            Your Ride Offering
          </motion.div>
        )}
      </div>

      <ParticipantsModal
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        participants={ride.participants || []}
        rideDetails={ride}
      />
    </motion.div>
  );
};

export default RideCard;
