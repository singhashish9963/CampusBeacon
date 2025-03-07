import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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

  // Fetch all rides - fixed to remove trailing slash
  const getAllRides = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching all rides..."); // Debug log
      const response = await api.get("/rides"); // Removed trailing slash for consistency

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
      console.error("Error in getAllRides:", err); // Debug log
      const errorMessage =
        err.response?.data?.message || "Error fetching rides";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user rides - fixed to match backend route
  const getUserRides = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching user rides..."); // Debug log
      const response = await api.get("/rides/user/rides"); // Matches the backend route order

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
      console.error("Error in getUserRides:", err); // Debug log
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
          await getAllRides(); // Refresh the rides list
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

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getAllRides();
        await getUserRides();
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, [getAllRides, getUserRides]);

  const clearError = useCallback(() => setError(null), []);

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
    clearError,
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
