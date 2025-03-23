import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  // Do not set the Content-Type globally since it may be overridden
});

// Thunk to fetch lost and found items
export const fetchLostItems = createAsyncThunk(
  "lostAndFound/fetchLostItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/lost-and-found/lost-items");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching lost items"
      );
    }
  }
);

// Thunk to add a new lost item
export const addLostItem = createAsyncThunk(
  "lostAndFound/addLostItem",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/lost-and-found/lost-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error adding lost item"
      );
    }
  }
);

// Thunk to update an existing lost item
export const updateLostItem = createAsyncThunk(
  "lostAndFound/updateLostItem",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/lost-and-found/lost-items/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating lost item"
      );
    }
  }
);

// Thunk to delete a lost item
export const deleteLostItem = createAsyncThunk(
  "lostAndFound/deleteLostItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/lost-and-found/lost-items/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting lost item"
      );
    }
  }
);

// Thunk to fetch a single lost item by its ID
export const getLostItemById = createAsyncThunk(
  "lostAndFound/getLostItemById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lost-items/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching lost item"
      );
    }
  }
);

const lostAndFoundSlice = createSlice({
  name: "lostAndFound",
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLostAndFoundError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching lost items
      .addCase(fetchLostItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLostItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLostItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle adding an item
      .addCase(addLostItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLostItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addLostItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updating an item
      .addCase(updateLostItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLostItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateLostItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleting an item
      .addCase(deleteLostItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLostItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteLostItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetching a single item by id
      .addCase(getLostItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLostItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(getLostItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLostAndFoundError } = lostAndFoundSlice.actions;
export default lostAndFoundSlice.reducer;
