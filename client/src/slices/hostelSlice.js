import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/hostels",
  withCredentials: true,
});

// Hostel Actions
export const createHostel = createAsyncThunk(
  "hostel/createHostel",
  async (hostelData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hostels/hostels", hostelData);
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
      const response = await api.get("/hostels/hostels");
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
      const response = await api.get(`/hostels/hostels/${id}`);
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
      const response = await api.post("/menus", menuData);
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
      const response = await api.get(`/menus/hostel/${hostelId}`);
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

export const updateMenuMeal = createAsyncThunk(
  "hostel/updateMenuMeal",
  async ({ hostelId, day, meal, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/menus/meal/${hostelId}/${day}/${meal}`,
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
        `/menus/meal/${hostelId}/${day}/${meal}`
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
      const response = await api.post("/officials", {
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
  async ({ hostelId, officialId, ...officialData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/officials/${officialId}`, {
        hostel_id: hostelId,
        ...officialData,
      });
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
      const response = await api.get(`/officials/hostel/${hostelId}`);
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
  async ({ hostelId, officialId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/officials/${officialId}`);
      if (response.data.success) {
        return { hostelId, officialId };
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
      const response = await api.post("/complaints", complaintData);
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
      const response = await api.get(`/complaints/hostel/${hostelId}`);
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
      const response = await api.put(`/complaints/${complaintId}/status`, {
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
      const response = await api.delete(`/complaints/${complaintId}`);
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
      const response = await api.post("/notifications", formData, {
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

export const getHostelNotifications = createAsyncThunk(
  "hostel/getHostelNotifications",
  async (hostelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications/${hostelId}`);
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

export const deleteNotification = createAsyncThunk(
  "hostel/deleteNotification",
  async ({ hostelId, notificationId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      if (response.data.success) {
        return { hostelId, notificationId };
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting notification"
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
        // Check if menu for this day already exists
        const existingIndex = state.menus[hostelId].findIndex(
          (menu) => menu.day === action.payload.day
        );
        if (existingIndex !== -1) {
          // Update existing menu
          state.menus[hostelId][existingIndex] = action.payload;
        } else {
          // Add new menu
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
        const hostelId = action.payload[0]?.hostel_id;
        if (hostelId) {
          state.menus[hostelId] = action.payload;
        }
      })
      .addCase(getMenuByHostel.rejected, (state, action) => {
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
        if (menuIndex !== -1) {
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
        if (menuIndex !== -1) {
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
        if (!state.officials[action.payload.hostel_id]) {
          state.officials[action.payload.hostel_id] = [];
        }
        state.officials[action.payload.hostel_id].push(action.payload);
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
        const index = state.officials[action.payload.hostel_id].findIndex(
          (o) => o.official_id === action.payload.official_id
        );
        if (index !== -1) {
          state.officials[action.payload.hostel_id][index] = action.payload;
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
        state.officials[action.payload[0]?.hostel_id] = action.payload;
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
        state.officials[action.payload.hostelId] = state.officials[
          action.payload.hostelId
        ].filter((o) => o.official_id !== action.payload.officialId);
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
        if (!state.complaints[action.payload.hostel_id]) {
          state.complaints[action.payload.hostel_id] = [];
        }
        state.complaints[action.payload.hostel_id].push(action.payload);
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
        state.complaints[action.payload[0]?.hostel_id] = action.payload;
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
            (c) => c.id === action.payload.id
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
        const hostelId = action.payload.hostel_id;
        if (state.complaints[hostelId]) {
          state.complaints[hostelId] = state.complaints[hostelId].filter(
            (c) => c.id !== action.payload
          );
        }
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
        if (!state.notifications[action.payload.hostel_id]) {
          state.notifications[action.payload.hostel_id] = [];
        }
        state.notifications[action.payload.hostel_id].push(action.payload);
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
        state.notifications[action.payload[0]?.hostel_id] = action.payload;
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
        const { hostelId, notificationId } = action.payload;
        state.notifications[hostelId] = state.notifications[hostelId].filter(
          (notification) => notification.id !== notificationId
        );
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
