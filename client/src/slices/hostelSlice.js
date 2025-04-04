import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Hostel Actions
export const createHostel = createAsyncThunk(
  "hostel/createHostel",
  async (hostelData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hostels", hostelData);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating hostel"
      );
    }
  }
);

export const getAllHostels = createAsyncThunk(
  "hostel/getAllHostels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hostels");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching hostels"
      );
    }
  }
);

export const getHostelById = createAsyncThunk(
  "hostel/getHostelById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hostels/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching hostel"
      );
    }
  }
);

// Menu Actions
export const createMenu = createAsyncThunk(
  "hostel/createMenu",
  async (menuData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hostels/menus", menuData);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating menu"
      );
    }
  }
);

export const getMenuByHostel = createAsyncThunk(
  "hostel/getMenuByHostel",
  async (hostelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hostels/menus/hostel/${hostelId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching menu"
      );
    }
  }
);

export const updateMenu = createAsyncThunk(
  "hostel/updateMenu",
  async ({ menuId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hostels/menus/${menuId}`, data);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating menu"
      );
    }
  }
);

export const updateMenuMeal = createAsyncThunk(
  "hostel/updateMenuMeal",
  async ({ hostelId, day, meal, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/hostels/menus/meal/${hostelId}/${day}/${meal}`,
        data
      );
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating meal"
      );
    }
  }
);

export const deleteMenuMeal = createAsyncThunk(
  "hostel/deleteMenuMeal",
  async ({ hostelId, day, meal }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/hostels/menus/meal/${hostelId}/${day}/${meal}`
      );
      if (response.data.success) {
        return { hostelId, day, meal };
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting meal"
      );
    }
  }
);

export const updateHostel = createAsyncThunk(
  "hostel/updateHostel",
  async ({ hostelId, ...hostelData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hostels/${hostelId}`, hostelData);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating hostel"
      );
    }
  }
);

export const deleteHostel = createAsyncThunk(
  "hostel/deleteHostel",
  async (hostelId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hostels/${hostelId}`);
      if (response.data.success) {
        return hostelId;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting hostel"
      );
    }
  }
);

// Officials Actions
export const createOfficial = createAsyncThunk(
  "hostel/createOfficial",
  async ({ hostelId, ...officialData }, { rejectWithValue }) => {
    try {
      const response = await api.post("/hostels/officials", {
        hostel_id: hostelId,
        ...officialData,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating official"
      );
    }
  }
);

export const editOfficial = createAsyncThunk(
  "hostel/editOfficial",
  async ({ officialId, ...officialData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/hostels/officials/${officialId}`,
        officialData
      );
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating official"
      );
    }
  }
);

export const getOfficialsByHostel = createAsyncThunk(
  "hostel/getOfficialsByHostel",
  async (hostelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hostels/officials/hostel/${hostelId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching officials"
      );
    }
  }
);

export const deleteOfficial = createAsyncThunk(
  "hostel/deleteOfficial",
  async (officialId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hostels/officials/${officialId}`);
      if (response.data.success) {
        return officialId;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting official"
      );
    }
  }
);

// Complaints Actions
export const createComplaint = createAsyncThunk(
  "hostel/createComplaint",
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hostels/complaints", complaintData);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating complaint"
      );
    }
  }
);

export const getComplaintsByHostel = createAsyncThunk(
  "hostel/getComplaintsByHostel",
  async (hostelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hostels/complaints/hostel/${hostelId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching complaints"
      );
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "hostel/updateComplaintStatus",
  async ({ complaintId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hostels/complaints/${complaintId}`, {
        status,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating complaint status"
      );
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  "hostel/deleteComplaint",
  async (complaintId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hostels/complaints/${complaintId}`);
      if (response.data.success) {
        return complaintId;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting complaint"
      );
    }
  }
);

// Notifications Actions
export const createNotification = createAsyncThunk(
  "hostel/createNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(notificationData).forEach((key) => {
        formData.append(key, notificationData[key]);
      });
      const response = await api.post("/hostels/notifications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating notification"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "hostel/deleteNotification",
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/hostels/notifications/${notificationId}`
      );
      if (response.data.success) {
        return notificationId;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting notification"
      );
    }
  }
);

export const getHostelNotifications = createAsyncThunk(
  "hostel/getHostelNotifications",
  async (hostelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hostels/notifications/${hostelId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching notifications"
      );
    }
  }
);

const initialState = {
  hostels: [],
  currentHostel: null,
  menus: {},
  officials: {},
  complaints: {},
  notifications: {},
  loading: false,
  errors: {
    hostel: null,
    menu: null,
    official: null,
    complaint: null,
    notification: null,
  },
};

const hostelSlice = createSlice({
  name: "hostel",
  initialState,
  reducers: {
    clearError: (state) => {
      state.errors = {
        hostel: null,
        menu: null,
        official: null,
        complaint: null,
        notification: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Hostel Actions
      .addCase(createHostel.pending, (state) => {
        state.loading = true;
        state.errors.hostel = null;
      })
      .addCase(createHostel.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels.push(action.payload);
      })
      .addCase(createHostel.rejected, (state, action) => {
        state.loading = false;
        state.errors.hostel = action.payload;
      })
      .addCase(getAllHostels.pending, (state) => {
        state.loading = true;
        state.errors.hostel = null;
      })
      .addCase(getAllHostels.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels = action.payload;
      })
      .addCase(getAllHostels.rejected, (state, action) => {
        state.loading = false;
        state.errors.hostel = action.payload;
      })
      .addCase(getHostelById.pending, (state) => {
        state.loading = true;
        state.errors.hostel = null;
      })
      .addCase(getHostelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHostel = action.payload;
      })
      .addCase(getHostelById.rejected, (state, action) => {
        state.loading = false;
        state.errors.hostel = action.payload;
      })
      // Menu Actions
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.errors.menu = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        if (!state.menus[hostelId]) {
          state.menus[hostelId] = [];
        }
        const existingIndex = state.menus[hostelId].findIndex(
          (menu) => menu.day === action.payload.day
        );
        if (existingIndex !== -1) {
          state.menus[hostelId][existingIndex] = action.payload;
        } else {
          state.menus[hostelId].push(action.payload);
        }
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.errors.menu = action.payload;
      })
      .addCase(getMenuByHostel.pending, (state) => {
        state.loading = true;
        state.errors.menu = null;
      })
      .addCase(getMenuByHostel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          const hostelId = action.payload[0].hostel_id;
          state.menus[hostelId] = action.payload;
        }
      })
      .addCase(getMenuByHostel.rejected, (state, action) => {
        state.loading = false;
        state.errors.menu = action.payload;
      })
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.errors.menu = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        const menuIndex = state.menus[hostelId]?.findIndex(
          (menu) => menu.menu_id === action.payload.menu_id
        );
        if (menuIndex !== -1) {
          state.menus[hostelId][menuIndex] = action.payload;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.errors.menu = action.payload;
      })
      .addCase(updateMenuMeal.pending, (state) => {
        state.loading = true;
        state.errors.menu = null;
      })
      .addCase(updateMenuMeal.fulfilled, (state, action) => {
        state.loading = false;
        const { hostel_id, day, meal } = action.payload;
        const menuIndex = state.menus[hostel_id]?.findIndex(
          (menu) => menu.day === day
        );
        if (menuIndex !== -1 && state.menus[hostel_id][menuIndex]) {
          state.menus[hostel_id][menuIndex][meal] = action.payload[meal];
        }
      })
      .addCase(updateMenuMeal.rejected, (state, action) => {
        state.loading = false;
        state.errors.menu = action.payload;
      })
      .addCase(deleteMenuMeal.pending, (state) => {
        state.loading = true;
        state.errors.menu = null;
      })
      .addCase(deleteMenuMeal.fulfilled, (state, action) => {
        state.loading = false;
        const { hostelId, day, meal } = action.payload;
        const menuIndex = state.menus[hostelId]?.findIndex(
          (menu) => menu.day === day
        );
        if (menuIndex !== -1 && state.menus[hostelId][menuIndex]) {
          state.menus[hostelId][menuIndex][meal] = null;
        }
      })
      .addCase(deleteMenuMeal.rejected, (state, action) => {
        state.loading = false;
        state.errors.menu = action.payload;
      })
      // Officials Actions
      .addCase(createOfficial.pending, (state) => {
        state.loading = true;
        state.errors.official = null;
      })
      .addCase(createOfficial.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        if (!state.officials[hostelId]) {
          state.officials[hostelId] = [];
        }
        state.officials[hostelId].push(action.payload);
      })
      .addCase(createOfficial.rejected, (state, action) => {
        state.loading = false;
        state.errors.official = action.payload;
      })
      .addCase(editOfficial.pending, (state) => {
        state.loading = true;
        state.errors.official = null;
      })
      .addCase(editOfficial.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        if (state.officials[hostelId]) {
          const index = state.officials[hostelId].findIndex(
            (o) => o.official_id === action.payload.official_id
          );
          if (index !== -1) {
            state.officials[hostelId][index] = action.payload;
          }
        }
      })
      .addCase(editOfficial.rejected, (state, action) => {
        state.loading = false;
        state.errors.official = action.payload;
      })
      .addCase(getOfficialsByHostel.pending, (state) => {
        state.loading = true;
        state.errors.official = null;
      })
      .addCase(getOfficialsByHostel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          const hostelId = action.payload[0].hostel_id;
          state.officials[hostelId] = action.payload;
        } else {
          const hostelId = action.meta.arg;
          state.officials[hostelId] = [];
        }
      })
      .addCase(getOfficialsByHostel.rejected, (state, action) => {
        state.loading = false;
        state.errors.official = action.payload;
      })
      .addCase(deleteOfficial.pending, (state) => {
        state.loading = true;
        state.errors.official = null;
      })
      .addCase(deleteOfficial.fulfilled, (state, action) => {
        state.loading = false;
        const officialId = action.payload;
        Object.keys(state.officials).forEach((hostelId) => {
          state.officials[hostelId] = state.officials[hostelId].filter(
            (o) => o.official_id !== officialId
          );
        });
      })
      .addCase(deleteOfficial.rejected, (state, action) => {
        state.loading = false;
        state.errors.official = action.payload;
      })
      // Complaints Actions
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.errors.complaint = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        if (!state.complaints[hostelId]) {
          state.complaints[hostelId] = [];
        }
        state.complaints[hostelId].push(action.payload);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.errors.complaint = action.payload;
      })
      .addCase(getComplaintsByHostel.pending, (state) => {
        state.loading = true;
        state.errors.complaint = null;
      })
      .addCase(getComplaintsByHostel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          const hostelId = action.payload[0].hostel_id;
          state.complaints[hostelId] = action.payload;
        } else {
          const hostelId = action.meta.arg;
          state.complaints[hostelId] = [];
        }
      })
      .addCase(getComplaintsByHostel.rejected, (state, action) => {
        state.loading = false;
        state.errors.complaint = action.payload;
      })
      .addCase(updateComplaintStatus.pending, (state) => {
        state.loading = true;
        state.errors.complaint = null;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        if (state.complaints[hostelId]) {
          const index = state.complaints[hostelId].findIndex(
            (c) => c.complaint_id === action.payload.complaint_id
          );
          if (index !== -1) {
            state.complaints[hostelId][index] = action.payload;
          }
        }
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.loading = false;
        state.errors.complaint = action.payload;
      })
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
        state.errors.complaint = null;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const complaintId = action.payload;
        Object.keys(state.complaints).forEach((hostelId) => {
          state.complaints[hostelId] = state.complaints[hostelId].filter(
            (c) => c.complaint_id !== complaintId
          );
        });
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.errors.complaint = action.payload;
      })
      // Notifications Actions
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.errors.notification = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        const hostelId = action.payload.hostel_id;
        if (!state.notifications[hostelId]) {
          state.notifications[hostelId] = [];
        }
        state.notifications[hostelId].push(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.errors.notification = action.payload;
      })
      .addCase(getHostelNotifications.pending, (state) => {
        state.loading = true;
        state.errors.notification = null;
      })
      .addCase(getHostelNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          const hostelId = action.payload[0].hostel_id;
          state.notifications[hostelId] = action.payload;
        } else {
          const hostelId = action.meta.arg;
          state.notifications[hostelId] = [];
        }
      })
      .addCase(getHostelNotifications.rejected, (state, action) => {
        state.loading = false;
        state.errors.notification = action.payload;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.errors.notification = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        const notificationId = action.payload;
        Object.keys(state.notifications).forEach((hostelId) => {
          state.notifications[hostelId] = state.notifications[hostelId].filter(
            (notification) => notification.notification_id !== notificationId
          );
        });
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.errors.notification = action.payload;
      })
      // Update Hostel
      .addCase(updateHostel.pending, (state) => {
        state.loading = true;
        state.errors.hostel = null;
      })
      .addCase(updateHostel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hostels.findIndex(
          (h) => h.id === action.payload.id
        );
        if (index !== -1) {
          state.hostels[index] = action.payload;
        }
        if (state.currentHostel?.id === action.payload.id) {
          state.currentHostel = action.payload;
        }
      })
      .addCase(updateHostel.rejected, (state, action) => {
        state.loading = false;
        state.errors.hostel = action.payload;
      })
      // Delete Hostel
      .addCase(deleteHostel.pending, (state) => {
        state.loading = true;
        state.errors.hostel = null;
      })
      .addCase(deleteHostel.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels = state.hostels.filter((h) => h.id !== action.payload);
        if (state.currentHostel?.id === action.payload) {
          state.currentHostel = null;
        }
      })
      .addCase(deleteHostel.rejected, (state, action) => {
        state.loading = false;
        state.errors.hostel = action.payload;
      });
  },
});

export const { clearError } = hostelSlice.actions;
export default hostelSlice.reducer;
