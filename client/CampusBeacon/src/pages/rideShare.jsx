import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, AlertTriangle } from "lucide-react";
import { useRides } from "../contexts/ridesContext";
import { useAuth } from "../contexts/AuthContext";
import { formatDateTime, isRideActive } from "../utils/dateUtils";
import RideHeader from "../components/rides/RideHeader";
import RideFilters from "../components/rides/RideFilters";
import RideGrid from "../components/rides/RideGrid";
import EmptyState from "../components/rides/EmptyState";
import RideFormModal from "../components/rides/RideFormModal";
import DeleteConfirmationModal from "../components/rides/DeleteConfirmationModal";

const RideShare = () => {
  const { rides, loading, error, createRide, updateRide, deleteRide } =
    useRides();
  const { user: currentUser } = useAuth();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRides, setFilteredRides] = useState([]);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [filters, setFilters] = useState({
    sortBy: "dateAsc",
    status: "all",
    timeFrame: null,
    dateRange: null,
    minSeats: null,
    maxPrice: null,
    direction: null,
    startDate: null,
    endDate: null,
  });

  // Utility functions for date boundaries
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getNextWeekStart = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = 7 - dayOfWeek + 1;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday;
  };

  const getNextWeekEnd = () => {
    const nextMonday = getNextWeekStart();
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    return nextSunday;
  };

  // Count active filters (search term counts as one filter)
  useEffect(() => {
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key !== "sortBy" && value !== null && value !== "all") {
        return acc + 1;
      }
      return acc;
    }, 0);

    setActiveFilterCount(count + (searchTerm ? 1 : 0));
  }, [filters, searchTerm]);

  // Filter and search logic
  useEffect(() => {
    if (rides) {
      let filtered = [...rides];

      // Search filter (pickup or drop location)
      if (searchTerm) {
        filtered = filtered.filter(
          (ride) =>
            ride.pickupLocation
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            ride.dropLocation.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Time frame filter (today or tomorrow)
      if (filters.timeFrame) {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        filtered = filtered.filter((ride) => {
          const rideDate = new Date(ride.departureDateTime);
          if (filters.timeFrame === "today") {
            return rideDate >= today && rideDate < tomorrow;
          }
          if (filters.timeFrame === "tomorrow") {
            return rideDate >= tomorrow && rideDate < dayAfterTomorrow;
          }
          return true;
        });
      }

      // Date range filter using predefined ranges or custom dates
      if (filters.dateRange) {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        // Calculate week boundaries
        const dayOfWeek = today.getDay();
        const daysUntilSunday = 7 - dayOfWeek;
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + daysUntilSunday);

        // Next week boundaries
        const nextWeekStart = getNextWeekStart();
        const nextWeekEnd = getNextWeekEnd();

        filtered = filtered.filter((ride) => {
          const rideDate = new Date(ride.departureDateTime);
          switch (filters.dateRange) {
            case "today":
              return rideDate >= today && rideDate < tomorrow;
            case "tomorrow":
              return rideDate >= tomorrow && rideDate < dayAfterTomorrow;
            case "week":
              return rideDate >= today && rideDate <= endOfWeek;
            case "nextWeek":
              return rideDate >= nextWeekStart && rideDate <= nextWeekEnd;
            case "custom":
              if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                startDate.setHours(0, 0, 0, 0);
                if (filters.endDate) {
                  const endDate = new Date(filters.endDate);
                  endDate.setHours(23, 59, 59, 999);
                  return rideDate >= startDate && rideDate <= endDate;
                } else {
                  const nextDay = new Date(startDate);
                  nextDay.setDate(startDate.getDate() + 1);
                  return rideDate >= startDate && rideDate < nextDay;
                }
              }
              return true;
            default:
              return true;
          }
        });
      }

      // If a specific startDate is provided without a dateRange selection
      if (filters.startDate && !filters.dateRange) {
        const filterDate = new Date(filters.startDate);
        filterDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(filterDate);
        nextDay.setDate(filterDate.getDate() + 1);
        filtered = filtered.filter((ride) => {
          const rideDate = new Date(ride.departureDateTime);
          return rideDate >= filterDate && rideDate < nextDay;
        });
      }

      // Seats filter
      if (filters.minSeats) {
        filtered = filtered.filter(
          (ride) => ride.availableSeats >= filters.minSeats
        );
      }

      // Price filter
      if (filters.maxPrice) {
        filtered = filtered.filter((ride) => ride.price <= filters.maxPrice);
      }

      // Direction filter
      if (filters.direction) {
        filtered = filtered.filter(
          (ride) => ride.direction === filters.direction
        );
      }

      // Sorting
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "dateAsc":
            return (
              new Date(a.departureDateTime) - new Date(b.departureDateTime)
            );
          case "dateDesc":
            return (
              new Date(b.departureDateTime) - new Date(a.departureDateTime)
            );
          case "priceAsc":
            return a.price - b.price;
          case "priceDesc":
            return b.price - a.price;
          case "seatsDesc":
            return b.availableSeats - a.availableSeats;
          default:
            return 0;
        }
      });

      setFilteredRides(filtered);
    }
  }, [rides, searchTerm, filters]);

  // Handle filter updates
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Form submission handler for creating/updating rides
  const handleFormSubmit = async (formData) => {
    try {
      if (editingRide) {
        await updateRide(editingRide.id, {
          ...formData,
          creatorId: currentUser.id,
        });
        setEditingRide(null);
      } else {
        await createRide({ ...formData, creatorId: currentUser.id });
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error submitting ride:", err);
    }
  };

  // Delete handler for rides
  const handleDelete = async (id) => {
    try {
      await deleteRide(id);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting ride:", err);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      sortBy: "dateAsc",
      status: "all",
      timeFrame: null,
      dateRange: null,
      minSeats: null,
      maxPrice: null,
      direction: null,
      startDate: null,
      endDate: null,
    });
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
        {/* Header and Filters */}
        <RideHeader
          onOfferRide={() => {
            setEditingRide(null);
            setIsFormOpen(true);
          }}
        />
        <RideFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
        />

        {/* Results Count */}
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

        {/* Rides Grid / Empty State */}
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

        {/* Modals */}
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