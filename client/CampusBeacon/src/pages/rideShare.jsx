import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useRides } from "../contexts/ridesContext";
import { useAuth } from "../contexts/authContext";
import RideCard from "../components/rides/RideCard";
import RideForm from "../components/rides/RideForm";
import { formatDateTime, isRideActive } from "../utils/dateUtils";

const RideShare = () => {
  const { rides, loading, error, createRide, updateRide, deleteRide } =
    useRides();
  const { user: currentUser } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRides, setFilteredRides] = useState([]);

  useEffect(() => {
    if (rides) {
      setFilteredRides(
        rides.filter(
          (ride) =>
            ride.pickupLocation
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            ride.dropLocation.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [rides, searchTerm]);

  // Handle edit button click
  const handleEdit = (ride) => {
    console.log("Editing ride:", ride);
    // Format the date for the form
    const formattedRide = {
      ...ride,
      departureDateTime: new Date(ride.departureDateTime)
        .toISOString()
        .slice(0, 16),
    };
    setEditingRide(formattedRide);
    setIsFormOpen(true);
  };

  // Handle form submission for both create and edit
  const handleFormSubmit = async (formData) => {
    try {
      if (editingRide) {
        console.log("Updating ride:", editingRide.id, formData);
        await updateRide(editingRide.id, {
          ...formData,
          creatorId: currentUser.id,
        });
        setEditingRide(null);
      } else {
        console.log("Creating new ride:", formData);
        await createRide({
          ...formData,
          creatorId: currentUser.id,
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting ride:", error);

    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteRide(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting ride:", error);

    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mr-3"
          >
            <Car className="w-8 h-8" />
          </motion.div>
          Loading rides...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-red-400 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-black/50 backdrop-blur-md py-4 -mx-8 px-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white flex items-center"
            >
              <Car className="mr-3" /> MNNIT Ride Share
            </motion.h1>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search rides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/40 border border-purple-500/50 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10 w-full md:w-64"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingRide(null);
                  setIsFormOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <Plus className="mr-2" /> Offer Ride
              </motion.button>
            </div>
          </div>
        </div>

        {/* Rides Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredRides.map((ride) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border-2 
                ${
                  isRideActive(ride.departureDateTime)
                    ? "border-purple-500/50"
                    : "border-gray-500/50"
                }`}
            >
              <RideCard
                ride={ride}
                currentUser={currentUser}
                onEdit={handleEdit} // Use the new handleEdit function
                onDelete={setConfirmDelete}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredRides.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-xl">
              {searchTerm
                ? "No rides found matching your search"
                : "No rides available. Create one to get started!"}
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-purple-400 hover:text-purple-300 underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {/* Form Modal */}
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setIsFormOpen(false);
                setEditingRide(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 p-8 rounded-xl max-w-lg w-full border-2 border-purple-500/30"
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
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingRide(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setConfirmDelete(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 p-8 rounded-xl max-w-md w-full border-2 border-red-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Trash2 className="mr-3 text-red-400" /> Confirm Deletion
                </h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this ride? This action cannot
                  be undone.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(confirmDelete)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RideShare;
