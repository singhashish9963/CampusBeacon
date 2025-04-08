import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/notification", {
        params: { page, limit },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to load notifications");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load notifications"
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
      return rejectWithValue(response.data.message || "Failed to retrieve notification");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to retrieve notification"
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (formDataPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/notification", formDataPayload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to create notification");
    } catch (err) {
      toast.error("Error creating notification");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create notification"
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notification/updateNotification",
  async ({ id, formDataPayload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notification/${id}`, formDataPayload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to update notification");
    } catch (err) {
      toast.error("Error updating notification");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update notification"
      );
    }
  }
);

export const broadcastNotification = createAsyncThunk(
  "notification/broadcastNotification",
  async (formDataPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/notification/broadcast", formDataPayload);
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return rejectWithValue(response.data.message || "Failed to broadcast notification");
    } catch (err) {
      toast.error("Error broadcasting notification");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to broadcast notification"
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
      return rejectWithValue(response.data.message || "Failed to delete notification");
    } catch (err) {
      toast.error("Error deleting notification");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete notification"
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
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to mark notification as read");
    } catch (err) {
      toast.error("Error marking notification as read");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    console.log("[Thunk MarkAll] Dispatching...");
    try {
      const response = await api.put("/notification/read-all");
      console.log("[Thunk MarkAll] API Response:", response.data);
      if (response.data.success) {
        console.log("[Thunk MarkAll] Success.");
        return true;
      }
      console.warn("[Thunk MarkAll] API returned success:false", response.data.message);
      return rejectWithValue(response.data.message || "Failed to mark all notifications as read");
    } catch (err) {
      console.error("[Thunk MarkAll] API Error:", err.response?.data || err.message || err);
      toast.error("Error marking all notifications as read");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Network/Server error during mark all as read"
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
      return rejectWithValue(response.data.message || "Failed to get unread count");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to get unread count"
      );
    }
  }
);

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
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(getNotification.pending, (state) => {
      })
      .addCase(getNotification.fulfilled, (state, action) => {
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload);
        if (!action.payload.is_read) {
          state.unreadCount += 1;
        }
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id
        );
        if (index !== -1) {
          const wasRead = state.notifications[index].is_read;
          const isNowRead = action.payload.is_read;
          state.notifications[index] = action.payload;
          if (!wasRead && isNowRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          } else if (wasRead && !isNowRead) {
            state.unreadCount += 1;
          }
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        const notificationToDelete = state.notifications.find(
          (n) => n.id === deletedId
        );
        if (notificationToDelete && !notificationToDelete.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n.id !== deletedId
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const updatedNotification = action.payload;
        const index = state.notifications.findIndex(
          (n) => n.id === updatedNotification.id
        );
        if (index !== -1) {
          const wasRead = state.notifications[index].is_read;
          state.notifications[index] = updatedNotification;
          if (!wasRead && updatedNotification.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications = state.notifications.map((n) =>
          n.is_read ? n : { ...n, is_read: true, read_at: new Date().toISOString() }
        );
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUnreadNotificationCount.pending, (state) => {
        state.error = null;
      })
      .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadNotificationCount.rejected, (state, action) => {
        console.error("Failed to get unread count:", action.payload);
        state.error = action.payload;
      })
      .addCase(broadcastNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(broadcastNotification.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Broadcast successful:", action.payload.message);
      })
      .addCase(broadcastNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addNotification, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
