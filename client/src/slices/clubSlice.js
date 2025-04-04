import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const fetchClubs = createAsyncThunk(
  "clubs/fetchClubs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/club/clubs");
      return response.data.clubs;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch clubs";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchClubById = createAsyncThunk(
  "clubs/fetchClubById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`club/clubs/${id}`);
      return response.data.club;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch club";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createClub = createAsyncThunk(
  "clubs/createClub",
  async (clubData, { rejectWithValue }) => {
    try {
      const response = await api.post("club/clubs", clubData);
      toast.success("Club created successfully");
      return response.data.club;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create club";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateClub = createAsyncThunk(
  "clubs/updateClub",
  async ({ id, clubData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`club/clubs/${id}`, clubData);
      toast.success("Club updated successfully");
      return response.data.club;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update club";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteClub = createAsyncThunk(
  "clubs/deleteClub",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`club/clubs/${id}`);
      toast.success("Club deleted successfully");
      return id;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete club";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const clubSlice = createSlice({
  name: "clubs",
  initialState: {
    clubs: [],
    currentClub: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearClubError: (state) => {
      state.error = null;
    },
    setCurrentClub: (state, action) => {
      state.currentClub = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchClubById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentClub = null;
      })
      .addCase(fetchClubById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClub = action.payload;
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs.push(action.payload);
      })
      .addCase(createClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClub.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = state.clubs.map((club) =>
          club.id === action.payload.id ? action.payload : club
        );
        if (state.currentClub && state.currentClub.id === action.payload.id) {
          state.currentClub = action.payload;
        }
      })
      .addCase(updateClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClub.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = state.clubs.filter((club) => club.id !== action.payload);
        if (state.currentClub && state.currentClub.id === action.payload) {
          state.currentClub = null;
        }
      })
      .addCase(deleteClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClubError, setCurrentClub } = clubSlice.actions;
export default clubSlice.reducer;
