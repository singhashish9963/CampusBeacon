import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const OfficialContext = createContext();

export const useOfficials = () => useContext(OfficialContext);

export const OfficialProvider = ({ children }) => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  const API_URL = "http://localhost:5000";

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/officials`);
      setOfficials(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch officials");
    } finally {
      setLoading(false);
    }
  };

  const getOfficial = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/officials/${id}`);
      setSelectedOfficial(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch official");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOfficial = async (officialData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/officials`, officialData);
      await fetchOfficials();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create official");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOfficial = async (id, officialData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/officials/${id}`, officialData);
      await fetchOfficials();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update official");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOfficial = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/officials/${id}`);
      setOfficials((prev) => prev.filter((official) => official.id !== id));
      if (selectedOfficial?.id === id) setSelectedOfficial(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete official");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  const value = {
    officials,
    loading,
    error,
    selectedOfficial,
    fetchOfficials,
    getOfficial,
    createOfficial,
    updateOfficial,
    deleteOfficial,
  };

  return (
    <OfficialContext.Provider value={value}>
      {children}
    </OfficialContext.Provider>
  );
};
