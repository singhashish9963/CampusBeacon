// src/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Removed: import toast from "react-hot-toast"; // Removed conflicting toast library

// Configure axios to send cookies with every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Removed the request interceptor that was reading token from localStorage.
// Keep the response interceptor for handling 401 errors if desired.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config.url.includes("/users/login") ||
      error.config.url.includes("/users/signup") ||
      error.config.url.includes("/users/current");

    // Optional: Handle redirection on 401 for non-auth endpoints
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Consider dispatching logout or directly redirecting
      // window.location.href = "/login"; // Direct redirect might be too abrupt
      // It might be better to dispatch an action that updates state,
      // allowing components to react (e.g., show login modal, redirect gracefully).
      // For now, just rejecting the promise.
      console.error("Received 401 Unauthorized for non-auth endpoint.");
    }
    return Promise.reject(error);
  }
);

// --- Async Thunks ---

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/current");
      // Ensure consistent structure even if user is null from backend
      const user = response.data?.data?.user || null;
      return user;
    } catch (error) {
      // Don't reject, just return null if not authenticated
      return null;
    }
  }
);

export const handleSignIn = createAsyncThunk(
  "auth/handleSignIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const user = response.data?.data?.user; // Use optional chaining

      if (!user) {
        // If backend structure is guaranteed, this might not be needed
        return rejectWithValue("Login failed: Invalid response from server.");
      }

      return user; // Return the user object on success
    } catch (error) {
      // Provide specific user-friendly messages based on status or backend message
      if (error.response?.status === 403) {
        return rejectWithValue("Please verify your email before logging in.");
      }
      if (error.response?.status === 401 || error.response?.status === 400) {
        return rejectWithValue("Invalid email or password.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to sign in. Please try again later."
      );
    }
  }
);

export const handleSignUp = createAsyncThunk(
  "auth/handleSignUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Assuming signup returns a success message or data, but not the user object directly
      // as verification is needed.
      const response = await api.post("/users/signup", { email, password });
      // Return data which might include a success message, but not user/auth state yet.
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  }
);

export const handleForgetPassword = createAsyncThunk(
  "auth/handleForgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      return response.data.message; // Return success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send password reset email."
      );
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
      return response.data.message; // Return success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Password reset failed. The link might be invalid or expired."
      );
    }
  }
);

export const handleEmailVerification = createAsyncThunk(
  "auth/handleEmailVerification",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/verify-email?token=${token}`);
      const user = response.data?.data?.user; // Use optional chaining

      if (!user) {
        return rejectWithValue(
          "Email verification failed: Invalid response from server."
        );
      }

      return user; // Return the user object, as verification logs them in
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Email verification failed. The link might be invalid or expired."
      );
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/handleLogout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/users/logout");
      // No need to dispatch logout() here, it's handled in the fulfilled reducer
      return true; // Indicate success
    } catch (error) {
      // Even if logout fails server-side, we should clear client state
      console.error("Server logout failed:", error);
      // Still return true or handle differently if needed, but usually clear client state regardless
      return rejectWithValue(
        "Server logout failed, but client session cleared."
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/admin/all");
      if (response.data.success && response.data.data?.users) {
        return response.data.data.users;
      } else {
        return rejectWithValue(
          response.data.message ||
            "Failed to fetch users: Invalid server response."
        );
      }
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue("Permission denied: Admin access required.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching users."
      );
    }
  }
);

// --- Slice Definition ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    roles: [],
    isAuthenticated: false,
    loading: false, // General loading for auth actions (login, signup, status check)
    error: null, // General error for auth actions
    lastChecked: null,
    allUsers: [], // List of all users (for admin)
    loadingUsers: false, // Specific loading state for fetching all users
    usersError: null, // Specific error state for fetching all users
  },
  reducers: {
    // Synchronous action to log out (clears state)
    logout: (state) => {
      state.user = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.lastChecked = null;
      state.error = null;
      // Optionally clear admin-specific state too
      state.allUsers = [];
      state.usersError = null;
    },
    // Synchronous action to clear the main auth error
    clearError: (state) => {
      state.error = null;
    },
    // Synchronous action to clear the users list error
    clearUsersError: (state) => {
      state.usersError = null;
    },
    // Action to force re-checking auth status (e.g., on window focus)
    invalidateAuth: (state) => {
      state.lastChecked = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- checkAuthStatus ---
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is user object or null
        state.roles = action.payload?.roles || [];
        state.isAuthenticated = !!action.payload; // true if user object exists, false if null
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        // Should ideally not reject, but handle gracefully
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = Date.now(); // Mark as checked even on failure
        state.error =
          action.payload || "Failed to check authentication status."; // Log error if needed
      })

      // --- handleSignIn ---
      .addCase(handleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is the user object
        state.roles = action.payload.roles || [];
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
        // Success toast is handled in the component
      })
      .addCase(handleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleSignUp ---
      .addCase(handleSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignUp.fulfilled, (state) => {
        state.loading = false;
        // Don't log in user yet, email verification needed
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = null;
        // Success toast (e.g., "Verification email sent") is handled in the component
      })
      .addCase(handleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleForgetPassword ---
      .addCase(handleForgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleForgetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Success toast is handled in the component
      })
      .addCase(handleForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleResetPassword ---
      .addCase(handleResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Success toast handled in the ResetPassword component
      })
      .addCase(handleResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleEmailVerification ---
      .addCase(handleEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Verification successful, log user in
        state.roles = action.payload.roles || [];
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
        // Success toast handled in the EmailVerification component
      })
      .addCase(handleEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleLogout ---
      .addCase(handleLogout.pending, (state) => {
        state.loading = true; // Can use general loading or a specific one
        state.error = null;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        // Clear all auth state regardless of server response (handled by reducer)
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = null;
        state.error = null;
        state.loading = false;
        // Optionally clear admin-specific state too
        state.allUsers = [];
        state.usersError = null;
        // Success feedback (e.g., redirect) handled where logout was dispatched
      })
      .addCase(handleLogout.rejected, (state, action) => {
        // Still clear client state even if server logout failed
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.lastChecked = null;
        // Optionally clear admin-specific state too
        state.allUsers = [];
        state.usersError = null;
        state.loading = false;
        // Log the server error, but don't necessarily show it prominently to user
        console.error("Logout rejected:", action.payload);
        state.error = action.payload; // Or set a generic client cleared message
      })

      // --- fetchAllUsers (Admin action) ---
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingUsers = true; // Use specific loading state
        state.usersError = null; // Use specific error state
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.allUsers = action.payload; // Update the users list
        state.usersError = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.usersError = action.payload; // Set the specific error
        state.allUsers = []; // Optionally clear list on error
        // Error toast/feedback handled in the Admin component checking state.usersError
      });
  },
});

// Export synchronous actions
export const { logout, clearError, clearUsersError, invalidateAuth } =
  authSlice.actions;

// Export the reducer
export default authSlice.reducer;
