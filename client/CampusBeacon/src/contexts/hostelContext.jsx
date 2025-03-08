import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// Function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleAuthError = (err) => {
  if (err.response?.status === 401) {
    localStorage.removeItem("authToken");
  }
};


// Hostel Context
const HostelContext = createContext();

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostels/hostels", { headers: getAuthHeaders() });
      setHostels(response.data.data);
    } catch (err) {
      handleAuthError(err);
      setError("Failed to fetch hostels");
    } finally {
      setLoading(false);
    }
  };

 const createHostel = async (hostelData) => {
    try {
      const response = await api.post("/hostels/hostels", hostelData, { headers: getAuthHeaders() });
      setHostels([...hostels, response.data.data]);
    } catch (err) {
      handleAuthError(err);
      setError("Failed to create hostel");
    }
  };

  const updateHostel = async (id, hostelData) => {
    try {
      const response = await api.put(`/hostels/hostels/${id}`, hostelData, { headers: getAuthHeaders() });
      setHostels(hostels.map(h => (h.id === id ? response.data.data : h)));
    } catch (err) {
      setError(err.response?.data?.message || "Error updating hostel");
    }
  };

  const deleteHostel = async (id) => {
    try {
      await api.delete(`/hostels/hostels/${id}`, { headers: getAuthHeaders() });
      setHostels(hostels.filter(h => h.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting hostel");
    }
  };


  return (
    <HostelContext.Provider
      value={{ hostels, loading, error, fetchHostels, createHostel, updateHostel, deleteHostel }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);

// Menu Context
const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenus = async (hostelId) => {
    setLoading(true);
    try {
      const response = await api.get(`/hostels/hostels/${hostelId}`, {
        headers: getAuthHeaders(),
      });
      setMenus(response.data.data);
    } catch (err) {
      console.error("Error fetching menus:", err.response?.data || err);
      setError(err.response?.data?.message || "Error fetching menus");
    } finally {
      setLoading(false);
    }
  };
  

  const createMenu = async (menuData) => {
    setLoading(true);
    try {
      const response = await api.post("/hostel/menu", menuData, {
        headers: getAuthHeaders(),
      });
      setMenus((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating menu:", err.response?.data || err);
      setError(err.response?.data?.message || "Error creating menu");
    } finally {
      setLoading(false);
    }
  };
  

 const updateMenuMeal = async (hostelId, day, meal, newMeal) => {
  setLoading(true);
  try {
    const response = await api.put(`/menu/${hostelId}/${day}/${meal}`, 
      { newMeal }, 
      { headers: getAuthHeaders() }
    );
    setMenus((prev) => prev.map(menu => (menu.day === day ? response.data.data : menu)));
  } catch (err) {
    console.error("Error updating meal:", err.response?.data || err);
    setError(err.response?.data?.message || "Error updating meal");
  } finally {
    setLoading(false);
  }
};


const deleteMenuMeal = async (hostelId, day, meal) => {
  setLoading(true);
  try {
    await api.delete(`/menu/${hostelId}/${day}/${meal}`, { headers: getAuthHeaders() });
    setMenus((prev) => prev.map(menu => (menu.day === day ? { ...menu, [meal]: null } : menu)));
  } catch (err) {
    console.error("Error deleting meal:", err.response?.data || err);
    setError(err.response?.data?.message || "Error deleting meal");
  } finally {
    setLoading(false);
  }
};


  return (
    <MenuContext.Provider
      value={{ menus, loading, error, fetchMenus, createMenu, updateMenuMeal, deleteMenuMeal }}
    >
      {children}
    </MenuContext.Provider>
  );
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
      const response = await api.get("/officials", { headers: getAuthHeaders() });
      setOfficials(response.data.data);
    } catch (err) {
      console.error("Error fetching officials:", err.response?.data || err);
      setError(err.response?.data?.message || "Error fetching officials");
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const createOfficial = async (officialData) => {
    try {
      const response = await api.post("/officials", officialData, { headers: getAuthHeaders() });
      setOfficials((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating official:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create official");
      handleAuthError(err);
    }
  };
  


  const updateOfficial = async (officialId, updatedData) => {
    try {
      const response = await api.put(`/officials/${officialId}`, updatedData, { headers: getAuthHeaders() });
      setOfficials((prev) =>
        prev.map((official) => (official.id === officialId ? response.data.data : official))
      );
    } catch (err) {
      console.error("Error updating official:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update official");
      handleAuthError(err);
    }
  };

  const deleteOfficial = async (officialId) => {
    try {
      await api.delete(`/officials/${officialId}`, { headers: getAuthHeaders() });
      setOfficials((prev) => prev.filter((official) => official.id !== officialId));
    } catch (err) {
      console.error("Error deleting official:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to delete official");
      handleAuthError(err);
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
      const response = await api.get("/hostels/complaints", { headers: getAuthHeaders() });
      setComplaints(response.data.data);
    } catch (err) {
      console.error("Error fetching complaints:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to fetch complaints");
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (complaintData) => {
    try {
      const response = await api.post("/hostel/complaints", complaintData, { headers: getAuthHeaders() });
      setComplaints((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating complaint:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create complaint");
    }
  };

  const updateComplaint = async (complaintId, updatedData) => {
    try {
      const response = await api.put(`/hostels/complaints/${complaintId}`, updatedData, { headers: getAuthHeaders() });
      setComplaints((prev) => prev.map((comp) => (comp.id === complaintId ? response.data.data : comp)));
    } catch (err) {
      console.error("Error updating complaint:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update complaint");
    }
  };

  const deleteComplaint = async (complaintId) => {
    try {
      await api.delete(`/hostels/complaints/${complaintId}`, { headers: getAuthHeaders() });
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
      const response = await api.get("/notifications", { headers: getAuthHeaders() });
      setNotifications(response.data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to fetch notifications");
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };
  


  const createNotification = async (data) => {
    try {
      const response = await api.post("/notifications", data, { headers: getAuthHeaders() });
      setNotifications((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Error creating notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error creating notification");
      handleAuthError(err);
    }
  };
  

  const updateNotification = async (notification_id, data) => {
    try {
      const response = await api.put(`/notifications/${notification_id}`, data, { headers: getAuthHeaders() });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notification_id ? response.data.data : notif))
      );
    } catch (err) {
      console.error("Error updating notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error updating notification");
      handleAuthError(err);
    }
  };
  

  const deleteNotification = async (notification_id) => {
    try {
      await api.delete(`/notifications/${notification_id}`, { headers: getAuthHeaders() });
      setNotifications((prev) => prev.filter((notif) => notif.id !== notification_id));
    } catch (err) {
      console.error("Error deleting notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error deleting notification");
      handleAuthError(err);
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



