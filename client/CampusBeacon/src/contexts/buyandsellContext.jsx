// contexts/buyAndSellContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const BuyAndSellContext = createContext(undefined);

export const BuyAndSellProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);


  const createItem = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/buy-and-sell/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setItems((prev) => [...prev, response.data.data]);
      setUserItems((prev) => [...prev, response.data.data]);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error creating item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, formData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/v1/buy-abd-sell/items/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setItems((prev) =>
        prev.map((item) => (item.id === id ? response.data.data : item))
      );
      setUserItems((prev) =>
        prev.map((item) => (item.id === id ? response.data.data : item))
      );

      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error updating item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/buy-and-sell/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setUserItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllItems = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/buy-and-sell/items?${params}`);
      setItems(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching items");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const getUserItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/buy-and-sell/user/items");
      setUserItems(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching user items");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getItemById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/buy-sell/items/${id}`);
      setCurrentItem(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching item");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const clearError = () => setError(null);
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


