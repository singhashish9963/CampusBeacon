import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const HostelMenuContext = createContext();

export const useHostelMenu = () => useContext(HostelMenuContext);

export const HostelMenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000";

  const fetchMenu = async (hostelId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/hostels/${hostelId}/menu`);
      setMenu(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const createMenuItem = async (hostelId, menuItem) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/hostels/${hostelId}/menu`, menuItem);
      await fetchMenu(hostelId);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create menu item");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMenuItem = async (hostelId, itemId, menuItem) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/hostels/${hostelId}/menu/${itemId}`, menuItem);
      await fetchMenu(hostelId);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update menu item");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (hostelId, itemId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/hostels/${hostelId}/menu/${itemId}`);
      setMenu((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete menu item");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetching menu requires a hostelId, so this should be triggered with an ID
  }, []);

  const value = {
    menu,
    loading,
    error,
    fetchMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };

  return (
    <HostelMenuContext.Provider value={value}>
      {children}
    </HostelMenuContext.Provider>
  );
};
