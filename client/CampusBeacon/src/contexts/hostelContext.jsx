import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
=============================
        Hostel Context
=============================
*/
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
      const response = await api.put(
        `/hostels/hostels/${hostel_id}`,
        hostelData
      );
      setHostels((prev) =>
        prev.map((h) => (h.hostel_id === hostel_id ? response.data.data : h))
      );
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
    <HostelContext.Provider
      value={{
        hostels,
        fetchHostels,
        createHostel,
        updateHostel,
        deleteHostel,
        loading,
      }}
    >
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

/*
=============================
        Menu Context
=============================
*/
const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch menus for a specific hostel
  const fetchMenuByHostel = useCallback(async (hostel_id) => {
    try {
      setLoading(true);
      const response = await api.get(`/hostels/menus/hostel/${hostel_id}`);
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
      const response = await api.get(`/hostels/menus/${menu_id}`);
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
      const response = await api.get(
        `/hostels/menus/meal/${hostel_id}/${day}/${meal}`
      );
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
      const response = await api.post("/hostels/menus", menuData);
      setMenus((prev) => [...prev, response.data.data]);
      return response.data.data;
    } catch (error) {
      console.error("Error creating menu:", error);
      throw error;
    }
  };

  // Update an existing menu's meal
  const updateMenuMeal = async (hostel_id, day, meal, newMeal) => {
    try {
      const response = await api.put(
        `/hostels/menus/meal/${hostel_id}/${day}/${meal}`,
        { newMeal }
      );
      setMenus((prev) =>
        prev.map((m) =>
          m.hostel_id === hostel_id && m.day === day ? response.data.data : m
        )
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating menu meal:", error);
      throw error;
    }
  };

  // Delete a specific meal from a menu
  const deleteMenuMeal = async (hostel_id, day, meal) => {
    try {
      const response = await api.delete(
        `/hostels/menus/meal/${hostel_id}/${day}/${meal}`
      );
      setMenus((prev) =>
        prev.map((m) =>
          m.hostel_id === hostel_id && m.day === day ? response.data.data : m
        )
      );
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

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

/*
=============================
        Official Context
=============================
*/
const OfficialContext = createContext(null);

export const OfficialProvider = ({ children }) => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all officials
  const fetchAllOfficials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/hostels/officials");
      setOfficials(response.data.data);
    } catch (error) {
      console.error("Error fetching officials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch an official by ID
  const fetchOfficialById = useCallback(async (official_id) => {
    try {
      if (!official_id) {
        console.error("Error: official_id is undefined or invalid!");
        return null;
      }
      console.log("Fetching official with ID:", official_id);
      setLoading(true);
      const response = await api.get(`/hostels/officials/${official_id}`);
      console.log("Fetched Official Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Error fetching official:",
        error.response?.data || error.message
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch officials by hostel ID
  const fetchOfficialsByHostel = useCallback(async (hostel_id) => {
    try {
      setLoading(true);
      const response = await api.get(`/hostels/officials/hostel/${hostel_id}`);
      setOfficials(response.data.data);
    } catch (error) {
      console.error("Error fetching officials by hostel:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new official
  const createOfficial = async (officialData) => {
    try {
      console.log("Sending Official Data:", officialData);
      const response = await api.post("/hostels/officials", officialData);
      console.log("API Response:", response.data);
      setOfficials((prev) => [...prev, response.data.data]);
      return response.data.data;
    } catch (error) {
      console.error("Error creating official:", error);
      console.error("Error Response:", error.response?.data);
      throw error;
    }
  };

  // Edit an existing official
  const editOfficial = async (official_id, updatedData) => {
    try {
      const response = await api.put(
        `/hostels/officials/${official_id}`,
        updatedData
      );
      setOfficials((prev) =>
        prev.map((official) =>
          official.official_id === official_id ? response.data.data : official
        )
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating official:", error);
      throw error;
    }
  };

  // Delete an official
  const deleteOfficial = async (official_id) => {
    try {
      console.log("Deleting official with ID:", official_id);
      await api.delete(`/hostels/officials/${official_id}`);
      setOfficials((prev) =>
        prev.filter((official) => official.official_id !== official_id)
      );
      console.log("Official deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting official:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return (
    <OfficialContext.Provider
      value={{
        officials,
        fetchAllOfficials,
        fetchOfficialById,
        fetchOfficialsByHostel,
        createOfficial,
        editOfficial,
        deleteOfficial,
        loading,
      }}
    >
      {children}
    </OfficialContext.Provider>
  );
};

export const useOfficial = () => {
  const context = useContext(OfficialContext);
  if (!context) {
    throw new Error("useOfficial must be used within an OfficialProvider");
  }
  return context;
};

/*
=============================
        Complaint Context
=============================
*/
const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all complaints
  const fetchAllComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/hostels/complaints");
      setComplaints(response.data.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setNotification({
        type: "error",
        message: "Error fetching complaints",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch complaint by ID
  const fetchComplaintById = useCallback(async (complaint_id) => {
    try {
      if (!complaint_id) {
        console.error("Error: complaint_id is undefined or invalid!");
        return null;
      }
      console.log("Fetching complaint with ID:", complaint_id);
      setLoading(true);
      const response = await api.get(`/hostels/complaints/${complaint_id}`);
      console.log("Fetched Complaint Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Error fetching complaint:",
        error.response?.data || error.message
      );
      setNotification({
        type: "error",
        message: "Error fetching complaint",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new complaint
  const createComplaint = async (complaintData) => {
    try {
      console.log("Sending Complaint Data:", complaintData);
      const response = await api.post("/hostels/complaints", complaintData);
      console.log("API Response:", response.data);
      setComplaints((prev) => [...prev, response.data.data]);
      setNotification({
        type: "success",
        message: "Complaint created successfully",
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating complaint:", error);
      setNotification({
        type: "error",
        message: "Error creating complaint",
      });
      throw error;
    }
  };

  // Edit an existing complaint
  const editComplaint = async (complaint_id, updatedData) => {
    try {
      const response = await api.put(
        `/hostels/complaints/${complaint_id}`,
        updatedData
      );
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.complaint_id === complaint_id
            ? response.data.data
            : complaint
        )
      );
      setNotification({
        type: "success",
        message: "Complaint updated successfully",
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating complaint:", error);
      setNotification({
        type: "error",
        message: "Error updating complaint",
      });
      throw error;
    }
  };

  // Delete a complaint
  const deleteComplaint = async (complaint_id) => {
    try {
      console.log("Deleting complaint with ID:", complaint_id);
      await api.delete(`/hostels/complaints/${complaint_id}`);
      setComplaints((prev) =>
        prev.filter((complaint) => complaint.complaint_id !== complaint_id)
      );
      setNotification({
        type: "success",
        message: "Complaint deleted successfully",
      });
    } catch (error) {
      console.error(
        "Error deleting complaint:",
        error.response?.data || error.message
      );
      setNotification({
        type: "error",
        message: "Error deleting complaint",
      });
      throw error;
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        fetchAllComplaints,
        fetchComplaintById,
        createComplaint,
        editComplaint,
        deleteComplaint,
        loading,
        notification,
        setNotification,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
};

/*
=============================
        Notifications Context
=============================
*/
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

  // Fetch notifications for a specific hostel
  const fetchHostelNotifications = async (hostel_id) => {
    setLoading(true);
    try {
      const response = await api.get(`/hostels/notifications/${hostel_id}`);
      setNotifications(response.data.data || []);
    } catch (err) {
      console.error(
        "Error fetching hostel notifications:",
        err.response?.data?.message || err
      );
      setError(
        err.response?.data?.message || "Failed to fetch hostel notifications"
      );
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
      const response = await api.put(
        `/hostels/notifications/${notification_id}`,
        data
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notification_id ? response.data.data : notif
        )
      );
    } catch (err) {
      console.error("Error updating notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error updating notification");
    }
  };

  const deleteNotification = async (notification_id) => {
    try {
      await api.delete(`/hostels/notifications/${notification_id}`);
      setNotifications((prev) =>
        prev.filter((notif) => notif.notification_id !== notification_id)
      );
    } catch (err) {
      console.error("Error deleting notification:", err.response?.data || err);
      setError(err.response?.data?.message || "Error deleting notification");
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        fetchNotifications,
        fetchHostelNotifications,
        createNotification,
        updateNotification,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
