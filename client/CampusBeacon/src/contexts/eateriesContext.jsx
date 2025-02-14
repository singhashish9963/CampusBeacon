// src/context/eateriesContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const EateriesContext = createContext();

export const useEateries = () => useContext(EateriesContext);

export const EateriesProvider = ({ children }) => {
  const [eateries, setEateries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEatery, setSelectedEatery] = useState(null);

  // Base URL can be configured based on your environment
  const API_URL =  "http://localhost:5000";

  // Fetch all eateries
  const fetchEateries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/eateries`);
      const formattedEateries = response.data.data.map((eatery) => ({
        ...eatery,
        ratings: eatery.rating ? [eatery.rating] : [],
        averageRating: eatery.rating || 0,
        isOpen: checkIsOpen(eatery.openingTime, eatery.closingTime),
        images: eatery.menuImageUrl ? [eatery.menuImageUrl] : [],
      }));
      setEateries(formattedEateries);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch eateries");
    } finally {
      setLoading(false);
    }
  };

  // Get a single eatery
  const getEatery = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/eateries/${id}`);
      const eatery = response.data.data;
      const formattedEatery = {
        ...eatery,
        ratings: eatery.rating ? [eatery.rating] : [],
        averageRating: eatery.rating || 0,
        isOpen: checkIsOpen(eatery.openingTime, eatery.closingTime),
        images: eatery.menuImageUrl ? [eatery.menuImageUrl] : [],
      };
      setSelectedEatery(formattedEatery);
      return formattedEatery;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch eatery");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new eatery
  const createEatery = async (eateryData, menuImage) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(eateryData).forEach((key) => {
        formData.append(key, eateryData[key]);
      });

      if (menuImage) {
        formData.append("menuImage", menuImage);
      }

      const response = await axios.post(`${API_URL}/eateries`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh the eateries list
      await fetchEateries();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create eatery");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an eatery
  const updateEatery = async (id, eateryData, menuImage) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(eateryData).forEach((key) => {
        formData.append(key, eateryData[key]);
      });

      if (menuImage) {
        formData.append("menuImage", menuImage);
      }

      const response = await axios.put(`${API_URL}/eateries/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh the eateries list
      await fetchEateries();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update eatery");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an eatery
  const deleteEatery = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/eateries/${id}`);

      // Remove from local state
      setEateries((prev) => prev.filter((eatery) => eatery.id !== id));
      if (selectedEatery?.id === id) {
        setSelectedEatery(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete eatery");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Submit a rating for an eatery
  const submitRating = async (eateryId, rating) => {
    setEateries((prev) =>
      prev.map((eatery) => {
        if (eatery.id === eateryId) {
          const newRatings = [...eatery.ratings, rating];
          const newAverage =
            newRatings.reduce((a, b) => a + b) / newRatings.length;
          return {
            ...eatery,
            ratings: newRatings,
            averageRating: Number(newAverage.toFixed(1)),
          };
        }
        return eatery;
      })
    );

    // You might want to send this rating to your backend
    try {
      const eatery = eateries.find((e) => e.id === eateryId);
      if (eatery) {
        await updateEatery(eateryId, {
          ...eatery,
          rating: eatery.averageRating,
        });
      }
    } catch (err) {
      console.error("Failed to update rating on server:", err);
    }
  };

  // Helper function to check if an eatery is currently open
  const checkIsOpen = (openTime, closeTime) => {
    if (!openTime || !closeTime) return false;

    const parseTime = (timeStr) => {
      if (!timeStr) return null;

      // If the time is already in 24-hour format
      if (timeStr.includes(":") && !timeStr.includes(" ")) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours + minutes / 60;
      }

      // If the time includes AM/PM
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return hours + minutes / 60;
    };

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    const openHour = parseTime(openTime);
    const closeHour = parseTime(closeTime);

    if (openHour === null || closeHour === null) return false;

    return currentHour >= openHour && currentHour <= closeHour;
  };

  // Fetch eateries on mount
  useEffect(() => {
    fetchEateries();
  }, []);

  const value = {
    eateries,
    loading,
    error,
    selectedEatery,
    fetchEateries,
    getEatery,
    createEatery,
    updateEatery,
    deleteEatery,
    submitRating,
    checkIsOpen,
  };

  return (
    <EateriesContext.Provider value={value}>
      {children}
    </EateriesContext.Provider>
  );
};
