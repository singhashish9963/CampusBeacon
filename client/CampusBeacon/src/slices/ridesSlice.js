import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
      updateFilteredRides(state);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      updateFilteredRides(state);
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
        updateFilteredRides(state);
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
        updateFilteredRides(state);
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
        updateFilteredRides(state);
      })
      .addCase(deleteRide.fulfilled, (state, action) => {
        state.rides = state.rides.filter((ride) => ride.id !== action.payload);
        state.userRides = state.userRides.filter(
          (ride) => ride.id !== action.payload
        );
        updateFilteredRides(state);
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

// Helper function to update filtered rides
const updateFilteredRides = (state) => {
  let filtered = [...state.rides];

  // Search filter
  if (state.searchTerm) {
    filtered = filtered.filter(
      (ride) =>
        ride.pickupLocation
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        ride.dropLocation.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

  // Time frame filter
  if (state.filters.timeFrame) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    filtered = filtered.filter((ride) => {
      const rideDate = new Date(ride.departureDateTime);
      if (state.filters.timeFrame === "today") {
        return rideDate >= today && rideDate < tomorrow;
      }
      if (state.filters.timeFrame === "tomorrow") {
        return rideDate >= tomorrow && rideDate < dayAfterTomorrow;
      }
      return true;
    });
  }

  // Date range filter
  if (state.filters.dateRange) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const dayOfWeek = today.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + daysUntilSunday);

    const getNextWeekStart = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysUntilNextMonday = 7 - dayOfWeek + 1;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilNextMonday);
      return nextMonday;
    };

    const getNextWeekEnd = () => {
      const nextMonday = getNextWeekStart();
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);
      return nextSunday;
    };

    filtered = filtered.filter((ride) => {
      const rideDate = new Date(ride.departureDateTime);
      switch (state.filters.dateRange) {
        case "today":
          return rideDate >= today && rideDate < tomorrow;
        case "tomorrow":
          return rideDate >= tomorrow && rideDate < dayAfterTomorrow;
        case "week":
          return rideDate >= today && rideDate <= endOfWeek;
        case "nextWeek":
          return rideDate >= getNextWeekStart() && rideDate <= getNextWeekEnd();
        case "custom":
          if (state.filters.startDate) {
            const startDate = new Date(state.filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (state.filters.endDate) {
              const endDate = new Date(state.filters.endDate);
              endDate.setHours(23, 59, 59, 999);
              return rideDate >= startDate && rideDate <= endDate;
            } else {
              const nextDay = new Date(startDate);
              nextDay.setDate(startDate.getDate() + 1);
              return rideDate >= startDate && rideDate < nextDay;
            }
          }
          return true;
        default:
          return true;
      }
    });
  }

  // Specific startDate filter
  if (state.filters.startDate && !state.filters.dateRange) {
    const filterDate = new Date(state.filters.startDate);
    filterDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(filterDate);
    nextDay.setDate(filterDate.getDate() + 1);
    filtered = filtered.filter((ride) => {
      const rideDate = new Date(ride.departureDateTime);
      return rideDate >= filterDate && rideDate < nextDay;
    });
  }

  // Seats filter
  if (state.filters.minSeats) {
    filtered = filtered.filter(
      (ride) => ride.availableSeats >= state.filters.minSeats
    );
  }

  // Price filter
  if (state.filters.maxPrice) {
    filtered = filtered.filter(
      (ride) =>
        ride.estimatedCost !== null &&
        ride.estimatedCost <= state.filters.maxPrice
    );
  }

  // Direction filter
  if (state.filters.direction) {
    filtered = filtered.filter(
      (ride) => ride.direction === state.filters.direction
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (state.filters.sortBy) {
      case "dateAsc":
        return new Date(a.departureDateTime) - new Date(b.departureDateTime);
      case "dateDesc":
        return new Date(b.departureDateTime) - new Date(a.departureDateTime);
      case "priceAsc":
        return (a.estimatedCost || 0) - (b.estimatedCost || 0);
      case "priceDesc":
        return (b.estimatedCost || 0) - (a.estimatedCost || 0);
      case "seatsDesc":
        return b.availableSeats - a.availableSeats;
      default:
        return 0;
    }
  });

  // Update filtered rides
  state.filteredRides = filtered;

  // Calculate active filter count
  const count = Object.entries(state.filters).reduce((acc, [key, value]) => {
    if (key !== "sortBy" && value !== null && value !== "all") {
      return acc + 1;
    }
    return acc;
  }, 0);

  state.activeFilterCount = count + (state.searchTerm ? 1 : 0);
};

export const {
  clearError,
  setSearchTerm,
  setFilters,
  setFilteredRides,
  setActiveFilterCount,
} = ridesSlice.actions;

export default ridesSlice.reducer;
