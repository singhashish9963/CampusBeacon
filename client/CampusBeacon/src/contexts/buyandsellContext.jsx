import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const BuyAndSellContext = createContext(undefined);

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://campusbeacon.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const BuyAndSellProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  const createItem = useCallback(async (formData) => {
    try {
      setLoading(true);
      const response = await api.post("/buy-and-sell/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setItems((prev) => [...prev, response.data.data]);
        setUserItems((prev) => [...prev, response.data.data]);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error creating item";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id, formData) => {
    try {
      setLoading(true);
      const response = await api.put(`/buy-and-sell/items/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? response.data.data : item))
        );
        setUserItems((prev) =>
          prev.map((item) => (item.id === id ? response.data.data : item))
        );
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error updating item";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/buy-and-sell/items/${id}`);

      if (response.data.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setUserItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error deleting item";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllItems = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await api.get(`/buy-and-sell/items?${params}`);

      if (response.data.success) {
        setItems(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching items";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/buy-and-sell/user-items");

      if (response.data.success) {
        setUserItems(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching user items";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getItemById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/buy-and-sell/items/${id}`);

      if (response.data.success) {
        setCurrentItem(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching item";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    items,
    userItems,
    loading,
    error,
    currentItem,
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    getUserItems,
    getItemById,
    clearError,
  };

  return (
    <BuyAndSellContext.Provider value={value}>
      {children}
    </BuyAndSellContext.Provider>
  );
};

export const useBuyAndSell = () => {
  const context = useContext(BuyAndSellContext);
  if (context === undefined) {
    throw new Error("useBuyAndSell must be used within a BuyAndSellProvider");
  }
  return context;
};

export default BuyAndSellProvider;
