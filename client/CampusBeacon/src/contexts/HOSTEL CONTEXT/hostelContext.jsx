import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const HostelContext = createContext();

export const useHostels = () => useContext(HostelContext);

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);

  const API_URL = "http://localhost:5000";

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/hostels`);
      setHostels(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hostels");
    } finally {
      setLoading(false);
    }
  };

  const getHostel = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/hostels/${id}`);
      setSelectedHostel(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hostel");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createHostel = async (hostelData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/hostels`, hostelData);
      await fetchHostels();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create hostel");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateHostel = async (id, hostelData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/hostels/${id}`, hostelData);
      await fetchHostels();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update hostel");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteHostel = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/hostels/${id}`);
      setHostels((prev) => prev.filter((hostel) => hostel.id !== id));
      if (selectedHostel?.id === id) setSelectedHostel(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete hostel");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const value = {
    hostels,
    loading,
    error,
    selectedHostel,
    fetchHostels,
    getHostel,
    createHostel,
    updateHostel,
    deleteHostel,
  };

  return (
    <HostelContext.Provider value={value}>
      {children}
    </HostelContext.Provider>

    
  );
};