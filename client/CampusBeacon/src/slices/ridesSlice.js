import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllRides = createAsyncThunk("rides/getAllRides", async () => {
  const response = await api.get("/rides");
  return response.data.data;
});

export const getUserRides = createAsyncThunk("rides/getUserRides", async () => {
  const response = await api.get("/rides/user/rides");
  return response.data.data;
});

export const createRide = createAsyncThunk(
  "rides/createRide",
  async (formData) => {
    const response = await api.post("/rides", formData);
    return response.data.data;
  }
);

export const updateRide = createAsyncThunk(
  "rides/updateRide",
  async ({ id, formData }) => {
    const response = await api.put(`/rides/${id}`, formData);
    return response.data.data;
  }
);

export const deleteRide = createAsyncThunk("rides/deleteRide", async (id) => {
  await api.delete(`/rides/${id}`);
  return id;
});

export const joinRide = createAsyncThunk("rides/joinRide", async (rideId) => {
  const response = await api.post(`/rides/${rideId}/join`);
  return response.data.data;
});

export const unjoinRide = createAsyncThunk(
  "rides/unjoinRide",
  async (rideId) => {
    const response = await api.delete(`/rides/${rideId}/join`);
    return response.data.data;
  }
);

const ridesSlice = createSlice({
  name: "rides",
  initialState: {
    rides: [],
    userRides: [],
    loading: false,
    error: null,
    currentRide: null,
    searchTerm: "",
    filteredRides: [],
    activeFilterCount: 0,
    filters: {
      sortBy: "dateAsc",
      status: "all",
      timeFrame: null,
      dateRange: null,
      minSeats: null,
      maxPrice: null,
      direction: null,
      startDate: null,
      endDate: null,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setFilteredRides: (state, action) => {
      state.filteredRides = action.payload;
    },
    setActiveFilterCount: (state, action) => {
      state.activeFilterCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRides.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(getAllRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserRides.fulfilled, (state, action) => {
        state.loading = false;
        state.userRides = action.payload;
      })
      .addCase(getUserRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.rides.push(action.payload);
        state.userRides.push(action.payload);
      })
      .addCase(updateRide.fulfilled, (state, action) => {
        const index = state.rides.findIndex(
          (ride) => ride.id === action.payload.id
        );
        state.rides[index] = action.payload;
        const userIndex = state.userRides.findIndex(
          (ride) => ride.id === action.payload.id
        );
        state.userRides[userIndex] = action.payload;
      })
      .addCase(deleteRide.fulfilled, (state, action) => {
        state.rides = state.rides.filter((ride) => ride.id !== action.payload);
        state.userRides = state.userRides.filter(
          (ride) => ride.id !== action.payload
        );
      })
      .addCase(joinRide.fulfilled, (state, action) => {
        if (state.currentRide && state.currentRide.id === action.meta.arg) {
          state.currentRide.participants = action.payload;
        }
      })
      .addCase(unjoinRide.fulfilled, (state, action) => {
        if (state.currentRide && state.currentRide.id === action.meta.arg) {
          state.currentRide.participants = action.payload;
        }
      });
  },
});

export const {
  clearError,
  setSearchTerm,
  setFilters,
  setFilteredRides,
  setActiveFilterCount,
} = ridesSlice.actions;

export default ridesSlice.reducer;
