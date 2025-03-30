import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Create a stable session ID to maintain conversation context
const getSessionId = () => {
  return (
    localStorage.getItem("chatSessionId") ||
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );
};

// Async thunk for asking questions
export const askQuestion = createAsyncThunk(
  "chatbot/askQuestion",
  async ({ question, sessionId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "chatbot/ask",
        { question },
        {
          headers: {
            "x-session-id": sessionId,
          },
        }
      );

      // The server returns { data: { answer, similarQuestions, category, confidence }, message: "..." }
      return response.data.data;
    } catch (error) {
      console.error(
        "Chatbot API Error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to get answer"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  sessionId: getSessionId(),
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSession: (state) => {
      const newSessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      state.sessionId = newSessionId;
      localStorage.setItem("chatSessionId", newSessionId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askQuestion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSession } = chatbotSlice.actions;
export default chatbotSlice.reducer;
