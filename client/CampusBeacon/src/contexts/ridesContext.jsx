import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const RidesContext = createContext(undefined);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/rides",
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

  const createRide = useCallback(async (formData) => {
    try {
      setLoading(true);
      const response = await api.post("/rides", formData);

      if (response.data.success) {
        setRides((prev) => [...prev, response.data.data]);
        setUserRides((prev) => [...prev, response.data.data]);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error creating ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRide = useCallback(async (id, formData) => {
    try {
      setLoading(true);
      const response = await api.put(`/rides/${id}`, formData);

      if (response.data.success) {
        setRides((prev) =>
          prev.map((ride) => (ride.id === id ? response.data.data : ride))
        );
        setUserRides((prev) =>
          prev.map((ride) => (ride.id === id ? response.data.data : ride))
        );
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error updating ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRide = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/rides/${id}`);

      if (response.data.success) {
        setRides((prev) => prev.filter((ride) => ride.id !== id));
        setUserRides((prev) => prev.filter((ride) => ride.id !== id));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error deleting ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllRides = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await api.get(`/rides?${params}`);

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
      const errorMessage =
        err.response?.data?.message || "Error fetching rides";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserRides = useCallback(async () => {
    try {
      setLoading(true);
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
      const errorMessage =
        err.response?.data?.message || "Error fetching user rides";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Join a ride
  const joinRide = useCallback(async (rideId) => {
    try {
      setLoading(true);
      const response = await api.post(`/rides/${rideId}/join`);

      if (response.data.success) {
        setRides((prev) =>
          prev.map((ride) =>
            ride.id === rideId
              ? {
                  ...ride,
                  availableSeats: ride.availableSeats - 1,
                  participants: [
                    ...(ride.participants || []),
                    response.data.data,
                  ],
                }
              : ride
          )
        );
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error joining ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Leave a ride
  const leaveRide = useCallback(async (rideId) => {
    try {
      setLoading(true);
      const response = await api.post(`/rides/${rideId}/leave`);

      if (response.data.success) {
        setRides((prev) =>
          prev.map((ride) =>
            ride.id === rideId
              ? {
                  ...ride,
                  availableSeats: ride.availableSeats + 1,
                  participants: (ride.participants || []).filter(
                    (p) => p.id !== response.data.data.id
                  ),
                }
              : ride
          )
        );
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error leaving ride";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
    joinRide,
    leaveRide,
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
