import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const fetchCoordinators = createAsyncThunk(
  "coordinators/fetchCoordinators",
  async (clubId = null, { rejectWithValue }) => {
    try {
      const url = clubId
        ? `/coordinator/coordinators?club_id=${clubId}`
        : "/coordinators";
      const response = await api.get(url);
      return response.data.coordinators;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch coordinators";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchCoordinatorById = createAsyncThunk(
  "coordinators/fetchCoordinatorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coordinator/coordinators/${id}`);
      return response.data.coordinator;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch coordinator";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createCoordinator = createAsyncThunk(
  "coordinators/createCoordinator",
  async (coordinatorData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/coordinator/coordinators",
        coordinatorData
      );
      toast.success("Coordinator created successfully");
      return response.data.coordinator;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create coordinator";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCoordinator = createAsyncThunk(
  "coordinators/updateCoordinator",
  async ({ id, coordinatorData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/coordinator/coordinators/${id}`,
        coordinatorData
      );
      toast.success("Coordinator updated successfully");
      return response.data.coordinator;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update coordinator";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteCoordinator = createAsyncThunk(
  "coordinators/deleteCoordinator",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/coordinator/coordinators/${id}`);
      toast.success("Coordinator deleted successfully");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete coordinator";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const coordinatorSlice = createSlice({
  name: "coordinators",
  initialState: {
    coordinators: [],
    currentCoordinator: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCoordinatorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoordinators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoordinators.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinators = action.payload;
      })
      .addCase(fetchCoordinators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.coordinators = [];
      })
      .addCase(fetchCoordinatorById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCoordinator = null;
      })
      .addCase(fetchCoordinatorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoordinator = action.payload;
      })
      .addCase(fetchCoordinatorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoordinator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoordinator.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinators.push(action.payload);
      })
      .addCase(createCoordinator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoordinator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoordinator.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinators = state.coordinators.map((coordinator) =>
          coordinator.id === action.payload.id ? action.payload : coordinator
        );
        if (
          state.currentCoordinator &&
          state.currentCoordinator.id === action.payload.id
        ) {
          state.currentCoordinator = action.payload;
        }
      })
      .addCase(updateCoordinator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCoordinator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoordinator.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinators = state.coordinators.filter(
          (coordinator) => coordinator.id !== action.payload
        );
        if (
          state.currentCoordinator &&
          state.currentCoordinator.id === action.payload
        ) {
          state.currentCoordinator = null;
        }
      })
      .addCase(deleteCoordinator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoordinatorError } = coordinatorSlice.actions;
export default coordinatorSlice.reducer;
