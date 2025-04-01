import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Configure axios instance
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/resources",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------------------
// Branch CRUD Thunks
// ------------------------------

// Fetch all branches
export const fetchBranches = createAsyncThunk(
  "resources/fetchBranches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/branches");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch branches"
      );
    }
  }
);

// Create branch
export const createBranch = createAsyncThunk(
  "resources/createBranch",
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await api.post("/branches", branchData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create branch"
      );
    }
  }
);

// Update branch
export const updateBranch = createAsyncThunk(
  "resources/updateBranch",
  async ({ id, branchData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/branches/${id}`, branchData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update branch"
      );
    }
  }
);

// Delete branch
export const deleteBranch = createAsyncThunk(
  "resources/deleteBranch",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/branches/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete branch"
      );
    }
  }
);

// ------------------------------
// Year CRUD Thunks
// ------------------------------

// Fetch all years
export const fetchYears = createAsyncThunk(
  "resources/fetchYears",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/years");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch years"
      );
    }
  }
);

// Create year
export const createYear = createAsyncThunk(
  "resources/createYear",
  async (yearData, { rejectWithValue }) => {
    try {
      const response = await api.post("/years", yearData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create year"
      );
    }
  }
);

// Update year
export const updateYear = createAsyncThunk(
  "resources/updateYear",
  async ({ id, yearData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/years/${id}`, yearData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update year"
      );
    }
  }
);

// Delete year
export const deleteYear = createAsyncThunk(
  "resources/deleteYear",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/years/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete year"
      );
    }
  }
);

// ------------------------------
// Subject CRUD Thunks
// ------------------------------

// Fetch all subjects
export const fetchSubjects = createAsyncThunk(
  "resources/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subjects");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subjects"
      );
    }
  }
);

// Create subject
export const createSubject = createAsyncThunk(
  "resources/createSubject",
  async (subjectData, { rejectWithValue }) => {
    try {
      const response = await api.post("/subjects", subjectData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subject"
      );
    }
  }
);

// Update subject
export const updateSubject = createAsyncThunk(
  "resources/updateSubject",
  async ({ id, subjectData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/subjects/${id}`, subjectData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subject"
      );
    }
  }
);

// Delete subject
export const deleteSubject = createAsyncThunk(
  "resources/deleteSubject",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/subjects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subject"
      );
    }
  }
);

// ------------------------------
// Study Material CRUD Thunks
// ------------------------------

// Note: For study material creation or update, a file upload is involved. In a real application,
// you might need to handle multipart form data. Here we assume that request interceptors handle this,
// or you pass FormData directly.

export const fetchStudyMaterials = createAsyncThunk(
  "resources/fetchStudyMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/study-materials");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch study materials"
      );
    }
  }
);

export const createStudyMaterial = createAsyncThunk(
  "resources/createStudyMaterial",
  async (formData, { rejectWithValue }) => {
    try {
      // formData should be FormData including file field
      const response = await api.post("/study-materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create study material"
      );
    }
  }
);

export const updateStudyMaterial = createAsyncThunk(
  "resources/updateStudyMaterial",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/study-materials/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update study material"
      );
    }
  }
);

export const deleteStudyMaterial = createAsyncThunk(
  "resources/deleteStudyMaterial",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/study-materials/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete study material"
      );
    }
  }
);

// ------------------------------
// Slice configuration
// ------------------------------

const initialState = {
  branches: [],
  years: [],
  subjects: [],
  studyMaterials: [],
  loading: false,
  error: null,
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    clearResourcesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --------------------
    // Branches
    // --------------------
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.branches.findIndex(
          (branch) => branch.branch_id === action.payload.branch_id
        );
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter(
          (branch) => branch.branch_id !== action.payload
        );
      });
    // --------------------
    // Years
    // --------------------
    builder
      .addCase(fetchYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYears.fulfilled, (state, action) => {
        state.loading = false;
        state.years = action.payload;
      })
      .addCase(fetchYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createYear.fulfilled, (state, action) => {
        state.years.push(action.payload);
      })
      .addCase(updateYear.fulfilled, (state, action) => {
        const index = state.years.findIndex(
          (year) => year.year_id === action.payload.year_id
        );
        if (index !== -1) {
          state.years[index] = action.payload;
        }
      })
      .addCase(deleteYear.fulfilled, (state, action) => {
        state.years = state.years.filter(
          (year) => year.year_id !== action.payload
        );
      });
    // --------------------
    // Subjects
    // --------------------
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(
          (subject) => subject.id === action.payload.id
        );
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(
          (subject) => subject.id !== action.payload
        );
      });
    // --------------------
    // Study Materials
    // --------------------
    builder
      .addCase(fetchStudyMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudyMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.studyMaterials = action.payload;
      })
      .addCase(fetchStudyMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStudyMaterial.fulfilled, (state, action) => {
        state.studyMaterials.push(action.payload);
      })
      .addCase(updateStudyMaterial.fulfilled, (state, action) => {
        const index = state.studyMaterials.findIndex(
          (material) => material.material_id === action.payload.material_id
        );
        if (index !== -1) {
          state.studyMaterials[index] = action.payload;
        }
      })
      .addCase(deleteStudyMaterial.fulfilled, (state, action) => {
        state.studyMaterials = state.studyMaterials.filter(
          (material) => material.material_id !== action.payload
        );
      });
  },
});

export const { clearResourcesError } = resourcesSlice.actions;
export default resourcesSlice.reducer;
