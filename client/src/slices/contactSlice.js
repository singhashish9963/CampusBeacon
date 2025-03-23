import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/contacts");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (contact, { rejectWithValue }) => {
    try {
      const isFormData = contact instanceof FormData;
      const response = await api.post("/contact/contacts", contact, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, updatedContact }, { rejectWithValue }) => {
    try {
      const isFormData = updatedContact instanceof FormData;
      const response = await api.put(
        `/contact/contacts/${id}`,
        updatedContact,
        {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/contacts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetchContacts
    builder.addCase(fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handling createContact
    builder.addCase(createContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createContact.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handling updateContact
    builder.addCase(updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    });
    builder.addCase(updateContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handling deleteContact
    builder.addCase(deleteContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default contactSlice.reducer;
