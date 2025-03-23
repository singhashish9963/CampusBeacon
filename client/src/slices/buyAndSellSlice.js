import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  // Do not set global Content-Type as it may be overridden
});

// Thunks for BuyAndSell actions

export const createItem = createAsyncThunk(
  "buyAndSell/createItem",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/buy-and-sell/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating item"
      );
    }
  }
);

export const updateItem = createAsyncThunk(
  "buyAndSell/updateItem",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/buy-and-sell/items/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating item"
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  "buyAndSell/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/buy-and-sell/items/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting item"
      );
    }
  }
);

export const getAllItems = createAsyncThunk(
  "buyAndSell/getAllItems",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `/buy-and-sell/items${params ? "?" + params : ""}`;
      const response = await api.get(url);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching items"
      );
    }
  }
);

export const getUserItems = createAsyncThunk(
  "buyAndSell/getUserItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/buy-and-sell/user-items");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching user items"
      );
    }
  }
);

export const getItemById = createAsyncThunk(
  "buyAndSell/getItemById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/buy-and-sell/items/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching item"
      );
    }
  }
);

const buyAndSellSlice = createSlice({
  name: "buyAndSell",
  initialState: {
    items: [],
    userItems: [],
    currentItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.userItems.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.userItems = state.userItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.userItems = state.userItems.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Items
      .addCase(getAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Items
      .addCase(getUserItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserItems.fulfilled, (state, action) => {
        state.loading = false;
        state.userItems = action.payload;
      })
      .addCase(getUserItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Item By Id
      .addCase(getItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = buyAndSellSlice.actions;
export default buyAndSellSlice.reducer;
