import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Helper to check if an eatery is open
export const checkIsOpen = (openTime, closeTime) => {
  if (!openTime || !closeTime) return false;

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    // If time is in 24-hour format ("13:30")
    if (timeStr.includes(":") && !timeStr.includes(" ")) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours + minutes / 60;
    }
    // If time includes AM/PM
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const openHour = parseTime(openTime);
  const closeHour = parseTime(closeTime);
  if (openHour === null || closeHour === null) return false;
  return currentHour >= openHour && currentHour <= closeHour;
};

// Thunk: Fetch all eateries
export const fetchEateries = createAsyncThunk(
  "eateries/fetchEateries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/eateries`);
      const formatted = response.data.data.map((eatery) => ({
        ...eatery,
        ratings: eatery.rating ? [eatery.rating] : [],
        averageRating: eatery.rating || 0,
        isOpen: checkIsOpen(eatery.openingTime, eatery.closingTime),
        images: eatery.menuImageUrl ? [eatery.menuImageUrl] : [],
      }));
      return formatted;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch eateries"
      );
    }
  }
);

// Thunk: Get a single eatery by id
export const getEatery = createAsyncThunk(
  "eateries/getEatery",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/eateries/${id}`);
      const eatery = response.data.data;
      const formatted = {
        ...eatery,
        ratings: eatery.rating ? [eatery.rating] : [],
        averageRating: eatery.rating || 0,
        isOpen: checkIsOpen(eatery.openingTime, eatery.closingTime),
        images: eatery.menuImageUrl ? [eatery.menuImageUrl] : [],
      };
      return formatted;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch eatery"
      );
    }
  }
);

// Thunk: Create a new eatery
export const createEatery = createAsyncThunk(
  "eateries/createEatery",
  async ({ eateryData, menuImage }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      Object.keys(eateryData).forEach((key) => {
        formData.append(key, eateryData[key]);
      });
      if (menuImage) {
        formData.append("menuImage", menuImage);
      }
      const response = await axios.post(`${API_URL}/eateries`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refresh eateries list after creation
      dispatch(fetchEateries());
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create eatery"
      );
    }
  }
);

// Thunk: Update an existing eatery
export const updateEatery = createAsyncThunk(
  "eateries/updateEatery",
  async ({ id, eateryData, menuImage }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      Object.keys(eateryData).forEach((key) => {
        formData.append(key, eateryData[key]);
      });
      if (menuImage) {
        formData.append("menuImage", menuImage);
      }
      const response = await axios.put(`${API_URL}/eateries/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchEateries());
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update eatery"
      );
    }
  }
);

// Thunk: Delete an eatery
export const deleteEatery = createAsyncThunk(
  "eateries/deleteEatery",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${API_URL}/eateries/${id}`);
      dispatch(fetchEateries());
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete eatery"
      );
    }
  }
);

// Thunk: Submit rating for an eatery
export const submitRating = createAsyncThunk(
  "eateries/submitRating",
  async ({ eateryId, rating }, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(`${API_URL}/eateries/${eateryId}/rate`, { rating });
      // Fetch updated eatery data
      const updatedEatery = await dispatch(getEatery(eateryId)).unwrap();
      dispatch(fetchEateries());
      return updatedEatery;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit rating"
      );
    }
  }
);

const eateriesSlice = createSlice({
  name: "eateries",
  initialState: {
    eateries: [],
    loading: false,
    error: null,
    selectedEatery: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedEatery: (state, action) => {
      state.selectedEatery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEateries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEateries.fulfilled, (state, action) => {
        state.loading = false;
        state.eateries = action.payload;
      })
      .addCase(fetchEateries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEatery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEatery.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEatery = action.payload;
      })
      .addCase(getEatery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEatery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEatery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createEatery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEatery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEatery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEatery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEatery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEatery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteEatery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEatery = action.payload;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedEatery } = eateriesSlice.actions;

export default eateriesSlice.reducer;
