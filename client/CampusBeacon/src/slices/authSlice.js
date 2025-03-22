import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async () => {
    const response = await api.get("/users/current");
    return response.data.data.user;
  }
);

export const handleSignIn = createAsyncThunk(
  "auth/handleSignIn",
  async ({ email, password }) => {
    const response = await api.post("/users/login", { email, password });
    return response.data.data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    roles: [],
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleSignIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
