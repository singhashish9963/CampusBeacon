import React from "react";
import { motion } from "framer-motion";
import { Users, X } from "lucide-react";

const ParticipantsModal = ({ isOpen, onClose, participants, rideDetails }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 p-6 sm:p-8 rounded-xl max-w-2xl w-full border-2 border-purple-500/30 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Users className="mr-3 text-purple-400" /> Ride Participants
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-2">
            Ride Details
          </h4>
          <p className="text-gray-300">
            {rideDetails.pickupLocation} → {rideDetails.dropLocation}
          </p>
          <p className="text-gray-400 text-sm">
            {new Date(rideDetails.departureDateTime).toLocaleString()}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Participants ({participants.length})
          </h4>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">
                    {participant.participant.name ||
                      participant.participant.email}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {participant.participant.email}
                  </p>
                </div>
                <div className="text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No participants yet
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParticipantsModal;
