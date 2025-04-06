import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import {
  fetchOverallPercentage,
  fetchSubjectWisePercentages,
} from "./attendanceSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config.url?.includes("/users/");
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !window.location.pathname.includes("/login")
    ) {
      console.warn("Redirect to login due to 401 intercepted.");
    }
    return Promise.reject(error);
  }
);

export const fetchUserEnrollments = createAsyncThunk(
  "enrollment/fetchUserEnrollments",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("User ID is required to fetch enrollments.");
    }
    try {
      const response = await api.get(
        `/enrollments/users/${userId}/enrollments`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Fetch User Enrollments Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch enrollments"
      );
    }
  }
);

export const enrollInSubject = createAsyncThunk(
  "enrollment/enrollInSubject",
  async ({ userId, subjectId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/enrollments", { userId, subjectId });
      dispatch(fetchUserEnrollments(userId));
      dispatch(fetchOverallPercentage(userId));
      dispatch(fetchSubjectWisePercentages(userId));
      return response.data;
    } catch (error) {
      console.error("Enroll Error:", error.response?.data);
      const errorMsg = error.response?.data?.message || "Failed to enroll";
      return rejectWithValue(errorMsg);
    }
  }
);

export const unenrollFromSubject = createAsyncThunk(
  "enrollment/unenrollFromSubject",
  async ({ userId, subjectId }, { rejectWithValue, dispatch }) => {
    if (!userId || !subjectId) {
      const msg = "User ID and Subject ID are required for unenrollment.";
      toast.error(msg);
      return rejectWithValue(msg);
    }

    try {
      const response = await api.delete("/enrollments", {
        data: { userId, subjectId },
      });

      toast.success(response.data.message || "Successfully unenrolled!");
      dispatch(fetchUserEnrollments(userId));
      dispatch(fetchOverallPercentage(userId));
      dispatch(fetchSubjectWisePercentages(userId));
      return { subjectId };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to unenroll";
      console.error("Unenroll Error Response:", error.response?.data || error);
      console.error("Unenroll Error Message:", errorMessage);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  userEnrollments: [],
  loading: false,
  enrollLoading: false,
  unenrollLoading: false,
  error: null,
  enrollError: null,
  unenrollError: null,
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    clearEnrollmentError: (state) => {
      state.error = null;
      state.enrollError = null;
      state.unenrollError = null;
    },
    resetEnrollments: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.userEnrollments = action.payload || [];
      })
      .addCase(fetchUserEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userEnrollments = [];
      })
      .addCase(enrollInSubject.pending, (state) => {
        state.enrollLoading = true;
        state.enrollError = null;
      })
      .addCase(enrollInSubject.fulfilled, (state) => {
        state.enrollLoading = false;
      })
      .addCase(enrollInSubject.rejected, (state, action) => {
        state.enrollLoading = false;
        state.enrollError = action.payload;
      })
      .addCase(unenrollFromSubject.pending, (state) => {
        state.unenrollError = null;
      })
      .addCase(unenrollFromSubject.fulfilled, (state, action) => {})
      .addCase(unenrollFromSubject.rejected, (state, action) => {
        state.unenrollError = action.payload;
      });
  },
});

export const { clearEnrollmentError, resetEnrollments } =
  enrollmentSlice.actions;
export default enrollmentSlice.reducer;
