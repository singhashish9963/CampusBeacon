import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, AlertTriangle, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime, isRideActive } from "../utils/dateUtils";
import RideHeader from "../components/rides/RideHeader";
import RideFilters from "../components/rides/RideFilters";
import RideGrid from "../components/rides/RideGrid";
import EmptyState from "../components/rides/EmptyState";
import RideFormModal from "../components/rides/RideFormModal";
import DeleteConfirmationModal from "../components/rides/DeleteConfirmationModal";
import {
  getAllRides,
  getUserRides,
  createRide,
  updateRide,
  deleteRide,
  setSearchTerm,
  setFilters,
  setFilteredRides,
  setActiveFilterCount,
} from "../slices/ridesSlice";

const RideShare = () => {
  const dispatch = useDispatch();
  const {
    rides,
    loading,
    error,
    filteredRides,
    activeFilterCount,
    searchTerm,
    filters,
  } = useSelector((state) => state.rides);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        await dispatch(getAllRides());
        await dispatch(getUserRides());
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };
    fetchRides();
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    dispatch(setSearchTerm(e.target.value));
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingRide) {
        await dispatch(
          updateRide({
            id: editingRide.id,
            formData: { ...formData, creatorId: currentUser.id },
          })
        );
        setEditingRide(null);
      } else {
        await dispatch(createRide({ ...formData, creatorId: currentUser.id }));
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error submitting ride:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteRide(id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting ride:", err);
    }
  };

  const clearAllFilters = () => {
    setSearchInput("");
    dispatch(setSearchTerm(""));
    dispatch(
      setFilters({
        timeFrame: null,
        dateRange: null,
        minSeats: null,
        maxPrice: null,
        direction: null,
        startDate: null,
        endDate: null,
      })
    );
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
        <div className="bg-red-900/50 backdrop-blur-md p-6 rounded-xl border border-red-500/50 max-w-lg mx-auto">
          <div className="flex items-center text-red-400 text-xl mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Error Loading Rides
          </div>
          <p className="text-white/80">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <RideHeader
          onOfferRide={() => {
            setEditingRide(null);
            setIsFormOpen(true);
          }}
        />
        <RideFilters
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
        />
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-300">
            {filteredRides.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredRides.length}
                </span>{" "}
                {filteredRides.length === 1 ? "ride" : "rides"}
              </>
            ) : (
              <span className="text-gray-400">No rides found</span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <div className="text-purple-400 text-sm flex items-center">
              <span className="mr-2 bg-purple-500/20 px-2 py-1 rounded-full text-xs">
                {activeFilterCount}{" "}
                {activeFilterCount === 1 ? "filter" : "filters"} active
              </span>
              <button
                onClick={clearAllFilters}
                className="text-purple-400 hover:text-purple-300 underline text-sm"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {filteredRides.length > 0 ? (
          <RideGrid
            rides={filteredRides}
            currentUser={currentUser}
            onEdit={(ride) => {
              const formattedRide = {
                ...ride,
                departureDateTime: new Date(ride.departureDateTime)
                  .toISOString()
                  .slice(0, 16),
              };
              setEditingRide(formattedRide);
              setIsFormOpen(true);
            }}
            onDelete={setConfirmDelete}
          />
        ) : (
          <EmptyState
            activeFilterCount={activeFilterCount}
            onOfferRide={() => {
              setEditingRide(null);
              setIsFormOpen(true);
            }}
            onClearFilters={clearAllFilters}
          />
        )}

        <AnimatePresence>
          {isFormOpen && (
            <RideFormModal
              key="ride-form-modal"
              isOpen={isFormOpen}
              editingRide={editingRide}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingRide(null);
              }}
            />
          )}
          {confirmDelete && (
            <DeleteConfirmationModal
              key="delete-confirm-modal"
              isOpen={Boolean(confirmDelete)}
              onDeleteConfirm={() => handleDelete(confirmDelete)}
              onCancel={() => setConfirmDelete(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RideShare;
