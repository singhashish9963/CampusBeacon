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
