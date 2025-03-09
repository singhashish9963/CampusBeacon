import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hostel Context
const HostelContext = createContext(null);

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHostels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/hostels/hostels");
      setHostels(response.data.data);
    } catch (error) {
      console.error("Error fetching hostels:", error);
    } finally {
      setLoading(false);
    }
  }, []);

 const createHostel = async (hostelData) => {
  try {
    const response = await api.post("/hostels/hostels", hostelData); 
    setHostels((prev) => [...prev, response.data.data]);
    return response.data.data;
  } catch (error) {
    console.error("Error creating hostel:", error);
    throw error;
  }
};

const updateHostel = async (hostel_id, hostelData) => {
  try {
    const response = await api.put(`/hostels/hostels/${hostel_id}`, hostelData); 
    setHostels((prev) => prev.map((h) => (h.hostel_id === hostel_id ? response.data.data : h)));
    return response.data.data;
  } catch (error) {
    console.error("Error updating hostel:", error);
    throw error;
  }
};

const deleteHostel = async (hostel_id) => {
  try {
    await api.delete(`/hostels/hostels/${hostel_id}`); 
    setHostels((prev) => prev.filter((h) => h.hostel_id !== hostel_id));
  } catch (error) {
    console.error("Error deleting hostel:", error);
    throw error;
  }
};


  return (
    <HostelContext.Provider value={{ hostels, fetchHostels, createHostel, updateHostel, deleteHostel, loading }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error("useHostel must be used within a HostelProvider");
  }
  return context;
};

// Menu Context
const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch menus for a specific hostel
  const fetchMenuByHostel = useCallback(async (hostel_id) => {
    try {
      setLoading(true);
      const response = await api.get(`/hostels/menus/hostel/${hostel_id}`); // Fetch menus by hostel_id
      setMenus(response.data.data);
    } catch (error) {
      console.error("Error fetching menus for hostel:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific menu by its ID
  const fetchMenuById = useCallback(async (menu_id) => {
    try {
      setLoading(true);
      const response = await api.get(`/hostels/menus/${menu_id}`); // Fetch a menu by menu_id
      return response.data.data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific meal from a menu
  const fetchMenuMeal = async (hostel_id, day, meal) => {
    try {
      setLoading(true);
      const response = await api.get(`/hostels/menus/meal/${hostel_id}/${day}/${meal}`); // Fetch meal by hostel_id, day, and meal type
      return response.data.data;
    } catch (error) {
      console.error("Error fetching menu meal:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new menu
  const createMenu = async (menuData) => {
    try {
      const response = await api.post("/hostels/menus", menuData); // POST request to create a new menu
      setMenus((prev) => [...prev, response.data.data]); // Add new menu to the list
      return response.data.data;
    } catch (error) {
      console.error("Error creating menu:", error);
      throw error;
    }
  };

  // Update an existing menu's meal
  const updateMenuMeal = async (hostel_id, day, meal, newMeal) => {
    try {
      const response = await api.put(`/hostels/menus/meal/${hostel_id}/${day}/${meal}`, { newMeal }); // PUT request to update meal
      setMenus((prev) => prev.map((m) => (m.hostel_id === hostel_id && m.day === day ? response.data.data : m))); // Update the menu in the list
      return response.data.data;
    } catch (error) {
      console.error("Error updating menu meal:", error);
      throw error;
    }
  };

  // Delete a specific meal from a menu
  const deleteMenuMeal = async (hostel_id, day, meal) => {
    try {
      const response = await api.delete(`/hostels/  menus/meal/${hostel_id}/${day}/${meal}`); // DELETE request to delete a meal
      setMenus((prev) => prev.map((m) => (m.hostel_id === hostel_id && m.day === day ? response.data.data : m))); // Remove the deleted meal
      return response.data.data;
    } catch (error) {
      console.error("Error deleting menu meal:", error);
      throw error;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menus,
        fetchMenuByHostel,
        fetchMenuById,
        fetchMenuMeal,
        createMenu,
        updateMenuMeal,
        deleteMenuMeal,
        loading,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook for using the menu context
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};


// Official Context
const OfficialContext = createContext();

export const OfficialProvider = ({ children }) => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostels/officials");
      setOfficials(response.data.data);
    } catch (err) {
      console.error("Error fetching officials:", err.response?.data || err);
      setError(err.response?.data?.message || "Error fetching officials");
    } finally {
      setLoading(false);
    }
  };
  
  const createOfficial = async (officialData) => {
    try {
      const response = await api.post("/hostels/officials", officialData);
      setOfficials((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating official:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create official");
    }
  };
  


  const updateOfficial = async (officialId, updatedData) => {
    try {
      const response = await api.put(`/hostels/officials/${officialId}`, updatedData);
      setOfficials((prev) =>
        prev.map((official) => (official.id === officialId ? response.data.data : official))
      );
    } catch (err) {
      console.error("Error updating official:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update official");
    }
  };

  const deleteOfficial = async (officialId) => {
    try {
      await api.delete(`/hostels/officials/${officialId}`);
      setOfficials((prev) => prev.filter((official) => official.id !== officialId));
    } catch (err) {
      console.error("Error deleting official:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to delete official");
    }
  };
  

 

  return (
    <OfficialContext.Provider
      value={{ officials, loading, error, fetchOfficials, createOfficial, updateOfficial, deleteOfficial }}
    >
      {children}
    </OfficialContext.Provider>
  );
};

export const useOfficial = () => useContext(OfficialContext);


// Complaints Context

const ComplaintsContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostels/complaints");
      setComplaints(response.data.data);
    } catch (err) {
      console.error("Error fetching complaints:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (complaintData) => {
    try {
      const response = await api.post("/hostel/complaints", complaintData);
      setComplaints((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating complaint:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create complaint");
    }
  };

  const updateComplaint = async (complaintId, updatedData) => {
    try {
      const response = await api.put(`/hostels/complaints/${complaintId}`, updatedData);
      setComplaints((prev) => prev.map((comp) => (comp.id === complaintId ? response.data.data : comp)));
    } catch (err) {
      console.error("Error updating complaint:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update complaint");
    }
  };

  const deleteComplaint = async (complaintId) => {
    try {
      await api.delete(`/hostels/complaints/${complaintId}`);
      setComplaints((prev) => prev.filter((comp) => comp.id !== complaintId));
    } catch (err) {
      console.error("Error deleting complaint:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, loading, error, fetchComplaints, createComplaint, updateComplaint, deleteComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintsContext);

// Notifications Context
const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostels/notifications");
      setNotifications(response.data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };
  


  const createNotification = async (data) => {
    try {
      const response = await api.post("/hostels/notifications", data);
      setNotifications((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error creating notification");
    }
  };
  

  const updateNotification = async (notification_id, data) => {
    try {
      const response = await api.put(`/hostels/notifications/${notification_id}`, data);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notification_id ? response.data.data : notif))
      );
    } catch (err) {
      console.error("Error updating notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error updating notification");
    }
  };
  

  const deleteNotification = async (notification_id) => {
    try {
      await api.delete(`/hostels/notifications/${notification_id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== notification_id));
    } catch (err) {
      console.error("Error deleting notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error deleting notification");
    }
  };
  

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, error, fetchNotifications, createNotification, updateNotification, deleteNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);



