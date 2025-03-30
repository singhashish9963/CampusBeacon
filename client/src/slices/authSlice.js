import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle token
api.interceptors.request.use(
  (config) => {
    // Check if there's a persisted auth state
    const persistedAuth = localStorage.getItem("persist:root");
    if (persistedAuth) {
      try {
        const { auth } = JSON.parse(persistedAuth);
        const { user } = JSON.parse(auth);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Error parsing persisted auth:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle 401 errors for auth-related endpoints
    const isAuthEndpoint = error.config.url.includes("/users/login") || 
                          error.config.url.includes("/users/signup") ||
                          error.config.url.includes("/users/current");
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear persisted state on unauthorized (only for non-auth endpoints)
      localStorage.removeItem("persist:root");
      // Redirect to login if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/current");
      const { user } = response.data.data;
      
      if (!user) {
        return null;
      }
      
      return user;
    } catch (error) {
      return null;
    }
  }
);

export const handleSignIn = createAsyncThunk(
  "auth/handleSignIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { user } = response.data.data;
      
      if (!user) {
        return rejectWithValue("Login failed. Please try again.");
      }
      
      return user;
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue("Please verify your email before logging in");
      }
      if (error.response?.status === 400) {
        return rejectWithValue("Invalid email or password");
      }
      return rejectWithValue("Unable to sign in. Please try again later");
    }
  }
);

export const handleSignUp = createAsyncThunk(
  "auth/handleSignUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/signup", { email, password });
      const { user } = response.data.data;
      
      if (!user) {
        return rejectWithValue("Signup failed. Please try again.");
      }
      
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const handleForgetPassword = createAsyncThunk(
  "auth/handleForgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

export const handleResetPassword = createAsyncThunk(
  "auth/handleResetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/reset-password", {
        token,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

export const handleEmailVerification = createAsyncThunk(
  "auth/handleEmailVerification",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/verify-email?token=${token}`);
      const { user } = response.data.data;
      
      if (!user) {
        return rejectWithValue("Email verification failed. Please try again.");
      }
      
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Email verification failed");
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/handleLogout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/users/logout");
      // Disconnect socket if it exists
      if (window.socket) {
        window.socket.disconnect();
        window.socket = null;
      }
      // Clear localStorage before resetting state
      localStorage.removeItem("persist:root");
      // Reset auth state
      dispatch(logout());
      return true;
    } catch (error) {
      return rejectWithValue("Unable to logout. Please try again.");
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
    lastChecked: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.lastChecked = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    invalidateAuth: (state) => {
      state.lastChecked = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.roles = action.payload.roles;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.roles = [];
          state.isAuthenticated = false;
        }
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(handleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(handleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(handleSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(handleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = Date.now();
        state.error = action.payload || "Signup failed";
      })
      .addCase(handleForgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleForgetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password reset failed";
      })
      .addCase(handleResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password reset failed";
      })
      .addCase(handleEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(handleEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = Date.now();
        state.error = action.payload || "Email verification failed";
      })
      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = null;
        state.error = null;
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, invalidateAuth } = authSlice.actions;

export default authSlice.reducer;
