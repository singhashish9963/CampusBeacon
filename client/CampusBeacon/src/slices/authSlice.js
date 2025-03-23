import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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

export const handleSignUp = createAsyncThunk(
  "auth/handleSignUp",
  async ({ email, password }) => {
    const response = await api.post("/users/signup", { email, password });
    return response.data.data.user;
  }
);

export const handleForgetPassword = createAsyncThunk(
  "auth/handleForgetPassword",
  async (email) => {
    const response = await api.post("/users/forgot-password", { email });
    return response.data.message;
  }
);

export const handleResetPassword = createAsyncThunk(
  "auth/handleResetPassword",
  async ({ token, newPassword }) => {
    const response = await api.post("/users/reset-password", {
      token,
      newPassword,
    });
    return response.data.message;
  }
);

export const handleEmailVerification = createAsyncThunk(
  "auth/handleEmailVerification",
  async (token) => {
    const response = await api.get(`/users/verify-email?token=${token}`);
    return response.data.data.user;
  }
);

export const handleLogout = createAsyncThunk(
  "auth/handleLogout",
  async (_, { dispatch }) => {
    try {
      await api.post("/users/logout");
      // Disconnect socket if it exists
      if (window.socket) {
        window.socket.disconnect();
        window.socket = null;
      }
      // Reset auth state
      dispatch(logout());
      // Clear localStorage manually
      localStorage.removeItem("persist:root");
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
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
      .addCase(handleSignIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
      })
      .addCase(handleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleSignUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
      })
      .addCase(handleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleForgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleForgetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleEmailVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
      })
      .addCase(handleEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
