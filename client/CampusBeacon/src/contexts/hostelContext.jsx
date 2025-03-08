import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
      const response = await axios.get(`${API_URL}/hostels`);
      setHostels(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching hostels");
    } finally {
      setLoading(false);
    }
  };

  const createHostel = async (hostelData) => {
    try {
      const response = await axios.post(`${API_URL}/hostels`, hostelData);
      setHostels([...hostels, response.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating hostel");
    }
  };

  const updateHostel = async (id, hostelData) => {
    try {
      const response = await axios.put(`${API_URL}/hostels/${id}`, hostelData);
      setHostels(hostels.map(h => (h.id === id ? response.data.data : h)));
    } catch (err) {
      setError(err.response?.data?.message || "Error updating hostel");
    }
  };

  const deleteHostel = async (id) => {
    try {
      await axios.delete(`${API_URL}/hostels/${id}`);
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
      const response = await axios.get(`${API_URL}/menu/hostel/${hostelId}`);
      setMenus(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching menus");
    } finally {
      setLoading(false);
    }
  };

  const createMenu = async (menuData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/menu`, menuData);
      setMenus([...menus, response.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating menu");
    } finally {
      setLoading(false);
    }
  };

  const updateMenuMeal = async (hostelId, day, meal, newMeal) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/menu/${hostelId}/${day}/${meal}`, { newMeal });
      setMenus(menus.map(menu => (menu.day === day ? response.data.data : menu)));
    } catch (err) {
      setError(err.response?.data?.message || "Error updating meal");
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuMeal = async (hostelId, day, meal) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/menu/${hostelId}/${day}/${meal}`);
      setMenus(menus.map(menu => (menu.day === day ? { ...menu, [meal]: null } : menu)));
    } catch (err) {
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
      const response = await axios.get(`${API_URL}/officials`);
      setOfficials(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch officials");
    }
    setLoading(false);
  };

  const createOfficial = async (officialData) => {
    try {
      const response = await axios.post(`${API_URL}/officials`, officialData);
      setOfficials([...officials, response.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create official");
    }
  };

  const updateOfficial = async (officialId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/officials/${officialId}`, updatedData);
      setOfficials(
        officials.map((official) =>
          official.id === officialId ? response.data.data : official
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update official");
    }
  };

  const deleteOfficial = async (officialId) => {
    try {
      await axios.delete(`${API_URL}/officials/${officialId}`);
      setOfficials(officials.filter((official) => official.id !== officialId));
    } catch (err) {
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

// Complaint Context
const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/complaints`);
      setComplaints(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComplaintContext.Provider value={{ complaints, loading, error, fetchComplaints }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaintContext = () => useContext(ComplaintContext);

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
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/notifications`, data);
      setNotifications((prev) => [...prev, response.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating notification");
    }
  };

  const updateNotification = async (notification_id, data) => {
    try {
      const response = await axios.put(`${API_URL}/notifications/${notification_id}`, data);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notification_id ? response.data.data : notif))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error updating notification");
    }
  };

  const deleteNotification = async (notification_id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${notification_id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== notification_id));
    } catch (err) {
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
