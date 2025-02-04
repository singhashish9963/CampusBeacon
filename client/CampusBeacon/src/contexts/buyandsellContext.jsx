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


}