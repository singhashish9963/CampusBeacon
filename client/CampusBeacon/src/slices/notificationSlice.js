import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  // We are not setting a global Content-Type so that FormData can work correctly.
});

// Thunks
export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/notification", {
        params: { page, limit },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Failed to load notifications"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to load notifications"
      );
    }
  }
);

export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notification/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Failed to retrieve notification"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to retrieve notification"
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (data, { rejectWithValue }) => {
    try {
      let payload;
      let headers = {};
      if (data.file) {
        payload = new FormData();
        Object.keys(data).forEach((key) => {
          payload.append(key, data[key]);
        });
      } else {
        payload = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
      }
      const response = await api.post("/notification", payload, { headers });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Failed to create notification"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to create notification"
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notification/updateNotification",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      let payload;
      let headers = {};
      if (data.file) {
        payload = new FormData();
        Object.keys(data).forEach((key) => {
          payload.append(key, data[key]);
        });
      } else {
        payload = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
      }
      const response = await api.put(`/notification/${id}`, payload, {
        headers,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Failed to update notification"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to update notification"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/notification/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(
        response.data.message || "Failed to delete notification"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete notification"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notification/${id}/read`);
      if (response.data.success) {
        return { id, data: response.data.data };
      }
      return rejectWithValue(
        response.data.message || "Failed to mark notification as read"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to mark notification as read"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put("/notification/read-all");
      if (response.data.success) {
        return response.data.data; // optionally return updated notifications
      }
      return rejectWithValue(
        response.data.message || "Failed to mark all notifications as read"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to mark all notifications as read"
      );
    }
  }
);

export const getUnreadNotificationCount = createAsyncThunk(
  "notification/getUnreadNotificationCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notification/unread/count");
      if (response.data.success) {
        return response.data.data.unreadCount;
      }
      return rejectWithValue(
        response.data.message || "Failed to get unread count"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to get unread count"
      );
    }
  }
);

export const broadcastNotification = createAsyncThunk(
  "notification/broadcastNotification",
  async (data, { rejectWithValue }) => {
    try {
      let payload;
      let headers = {};
      if (data.file) {
        payload = new FormData();
        Object.keys(data).forEach((key) => {
          payload.append(key, data[key]);
        });
      } else {
        payload = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
      }
      const response = await api.post("/notification/broadcast", payload, {
        headers,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data.message || "Failed to broadcast notification"
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to broadcast notification"
      );
    }
  }
);

// Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optionally, you can add a synchronous action to set notifications directly.
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // getNotifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getNotification (no state update besides error handling)
      .addCase(getNotification.pending, (state) => {
        state.error = null;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        // You can update current notification here if desired.
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.error = action.payload;
      })
      // createNotification
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateNotification
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((n) =>
          n.id === action.payload.id ? action.payload : n
        );
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteNotification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // markNotificationAsRead
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((n) =>
          n.id === action.payload.id ? { ...n, is_read: true } : n
        );
        // Optionally update unreadCount here (for example, decrement)
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date(),
        }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getUnreadNotificationCount
      .addCase(getUnreadNotificationCount.pending, (state) => {
        state.error = null;
      })
      .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadNotificationCount.rejected, (state, action) => {
        state.error = action.payload;
      })
      // broadcastNotification
      .addCase(broadcastNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(broadcastNotification.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend broadcasted notifications to the existing list.
        state.notifications = [...action.payload, ...state.notifications];
      })
      .addCase(broadcastNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
