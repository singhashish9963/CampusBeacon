import React, { useState, useCallback, createContext,useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ContactContext = createContext(null);

export const ContactContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const { user } = useAuth();

    const fetchContact = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/contact/contacts');
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching lost and found items:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ContactContext.Provider value={{ loading, items, fetchContact }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = () => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContact must be used within a ContactContextProvider');
    }
    return context;
};