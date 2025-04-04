import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (clubId = null, { rejectWithValue }) => {
    try {
      const url = clubId ? `/events/events?club_id=${clubId}` : "/events";
      const response = await api.get(url);
      return response.data.events;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch events";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/events/${id}`);
      return response.data.event;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch event";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/events/events", eventData);
      toast.success("Event created successfully");
      return response.data.event;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create event";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/events/events/${id}`, eventData);
      toast.success("Event updated successfully");
      return response.data.event;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update event";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/events/${id}`);
      toast.success("Event deleted successfully");
      return id;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete event";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.events = [];
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
        if (state.currentEvent && state.currentEvent.id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
