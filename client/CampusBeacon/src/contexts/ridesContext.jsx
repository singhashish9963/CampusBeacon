import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const RidesContext = createContext(undefined);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const RidesProvider = ({ children }) => {
  const [rides, setRides] = useState([]);
  const [userRides, setUserRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);

  // Fetch all rides
  const getAllRides = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching all rides...");
      const response = await api.get("/rides");

      if (response.data.success) {
        const sortedRides = response.data.data.sort(
          (a, b) =>
            new Date(a.departureDateTime) - new Date(b.departureDateTime)
        );
        setRides(sortedRides);
        return sortedRides;
      }
      throw new Error(response.data.message);
    } catch (err) {
      console.error("Error in getAllRides:", err);
      const errorMessage =
        err.response?.data?.message || "Error fetching rides";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user rides
  const getUserRides = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching user rides...");
      const response = await api.get("/rides/user/rides");

      if (response.data.success) {
        const sortedRides = response.data.data.sort(
          (a, b) =>
            new Date(a.departureDateTime) - new Date(b.departureDateTime)
        );
        setUserRides(sortedRides);
        return sortedRides;
      }
      throw new Error(response.data.message);
    } catch (err) {
      console.error("Error in getUserRides:", err);
      const errorMessage =
        err.response?.data?.message || "Error fetching user rides";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create ride
  const createRide = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        const response = await api.post("/rides", formData);

        if (response.data.success) {
          setRides((prev) => [...prev, response.data.data]);
          setUserRides((prev) => [...prev, response.data.data]);
          // Optionally refresh rides list if needed:
          await getAllRides();
          return response.data.data;
        }
        throw new Error(response.data.message);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error creating ride";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getAllRides]
  );

  // Update ride
  const updateRide = useCallback(
    async (id, formData) => {
      try {
        setLoading(true);
        const response = await api.put(`/rides/${id}`, formData);

        if (response.data.success) {
          await getAllRides(); // Refresh all rides
          await getUserRides(); // Refresh user rides
          return response.data.data;
        }
        throw new Error(response.data.message);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error updating ride";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getAllRides, getUserRides]
  );

  // Delete ride
  const deleteRide = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await api.delete(`/rides/${id}`);

        if (response.data.success) {
          await getAllRides(); // Refresh all rides
          await getUserRides(); // Refresh user rides
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting ride";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getAllRides, getUserRides]
  );

  // Get single ride
  const getRideById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/rides/${id}`);

      if (response.data.success) {
        setCurrentRide(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Join ride
  const joinRide = useCallback(
    async (rideId) => {
      try {
        setLoading(true);
        const response = await api.post(`/rides/${rideId}/join`);
        if (response.data.success) {
          // Optionally update the current ride if it's the one joined
          if (currentRide && currentRide.id === rideId) {
            // For example, merge participants data into currentRide
            setCurrentRide((prev) => ({
              ...prev,
              participants: response.data.data,
            }));
          }
          return response.data.data;
        }
        throw new Error(response.data.message);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error joining ride";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [currentRide]
  );

  const clearError = useCallback(() => setError(null), []);

  // Client-side filtering and sorting of rides (and related state)
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

  // Count active filters (search term counts as one filter)
  React.useEffect(() => {
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key !== "sortBy" && value !== null && value !== "all") {
        return acc + 1;
      }
      return acc;
    }, 0);

    setActiveFilterCount(count + (searchTerm ? 1 : 0));
  }, [filters, searchTerm]);

  // Filter and search logic
  React.useEffect(() => {
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

        const dayOfWeek = today.getDay();
        const daysUntilSunday = 7 - dayOfWeek;
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + daysUntilSunday);

        // Next week boundaries
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
              return (
                rideDate >= getNextWeekStart() && rideDate <= getNextWeekEnd()
              );
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

      // Specific startDate filter if no dateRange is selected
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

      // Price filter using estimatedCost field
      if (filters.maxPrice) {
        filtered = filtered.filter(
          (ride) =>
            ride.estimatedCost !== null &&
            ride.estimatedCost <= filters.maxPrice
        );
      }

      // Direction filter
      if (filters.direction) {
        filtered = filtered.filter(
          (ride) => ride.direction === filters.direction
        );
      }

      // Sorting logic updated for estimatedCost instead of price
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
            return (a.estimatedCost || 0) - (b.estimatedCost || 0);
          case "priceDesc":
            return (b.estimatedCost || 0) - (a.estimatedCost || 0);
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
      if (formData.id) {
        await updateRide(formData.id, formData);
      } else {
        await createRide(formData);
      }
    } catch (err) {
      console.error("Error submitting ride:", err);
    }
  };
   const unjoinRide = useCallback(
     async (rideId) => {
       try {
         setLoading(true);
         const response = await api.delete(`/rides/${rideId}/join`);
         if (response.data.success) {
           if (currentRide && currentRide.id === rideId) {
             setCurrentRide((prev) => ({
               ...prev,
               participants: response.data.data,
             }));
           }
           await getAllRides();
           return response.data.data;
         }
         throw new Error(response.data.message);
       } catch (err) {
         const errorMessage =
           err.response?.data?.message || "Error cancelling ride join";
         setError(errorMessage);
         throw new Error(errorMessage);
       } finally {
         setLoading(false);
       }
     },
     [currentRide, getAllRides]
   );


  const value = {
    rides,
    userRides,
    loading,
    error,
    currentRide,
    createRide,
    updateRide,
    deleteRide,
    getAllRides,
    getUserRides,
    getRideById,
    joinRide, // New join ride function
    unjoinRide,
    clearError,
    searchTerm,
    setSearchTerm,
    filteredRides,
    activeFilterCount,
    filters,
    handleFilterChange,
    handleFormSubmit,
  };

  return (
    <RidesContext.Provider value={value}>{children}</RidesContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RidesContext);
  if (context === undefined) {
    throw new Error("useRides must be used within a RidesProvider");
  }
  return context;
};

export default RidesProvider;
