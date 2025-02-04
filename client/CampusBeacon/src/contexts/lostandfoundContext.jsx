import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "./AuthContext";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const LostAndFoundContext = createContext(null);

export const LostAndFoundProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/lost-and-found/lost-items');
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching lost and found items:', error);
        } finally {
            setLoading(false);
        }
    }, []);
      const addItem = async (formData) => {
        try {
          const response = await api.post(
            "/lost-and-found/lost-items",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setItems((prev) => [...prev, response.data.data]);
          return response.data.data;
        } catch (error) {
          console.error("Error adding item:", error);
          throw error;
        }
      };
      
      const updateItem = async (id, formData) => {
        try {
          const response = await api.put(
            `/lost-and-found/lost-items/${id}`,
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
          return response.data.data;
        } catch (error) {
          console.error("Error updating item:", error);
          throw error;
        }
      };
      
      const deleteItem = async (id) => {
        try {
          await api.delete(`/lost-items/${id}`);
          setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
          console.error("Error deleting item:", error);
          throw error;
        }
      };

      const getItem = async (id) => {
        try {
          const response = await api.get(`/lost-items/${id}`);
          return response.data.data;
        } catch (error) {
          console.error("Error getting item:", error);
          throw error;
        }
      };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <LostAndFoundContext.Provider 
            value={{ 
                items, 
                fetchItems, 
                addItem, 
                updateItem, 
                deleteItem, 
                getItem 
            }}
        >
            {children}
        </LostAndFoundContext.Provider>
    );
};

export const useLostAndFound = () => {
    const context = useContext(LostAndFoundContext);
    if (!context) {
        throw new Error('useLostAndFound must be used within a LostAndFoundProvider');
    }
    return context;
};
