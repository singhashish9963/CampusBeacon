import React, { useState, useCallback, createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  // Do not set Content-Type globally. It will be overridden
});

const ContactContext = createContext(null);

export const ContactContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  const fetchContact = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact/contacts");
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContact = async (contact) => {
    try {
      const isFormData = contact instanceof FormData;
      const response = await api.post("/contact/contacts", contact, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      setItems((prevItems) => [...prevItems, response.data.data]);
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const updateContact = async (id, updatedContact) => {
    try {
      const isFormData = updatedContact instanceof FormData;
      const response = await api.put(
        `/contact/contacts/${id}`,
        updatedContact,
        {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        }
      );
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? response.data.data : item))
      );
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/contact/contacts/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        loading,
        items,
        fetchContact,
        createContact,
        updateContact,
        deleteContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactContextProvider");
  }
  return context;
};
