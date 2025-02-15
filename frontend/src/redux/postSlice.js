// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstances";

const initialState = {
  post: null,
  isLoading: false,
  error: null,
};

export const createPostThread = createAsyncThunk(
  "post",
  async ({ userID, content }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "Posts",
        { userID, content },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create post cases
      .addCase(createPostThread.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPostThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload.post;
        state.error = null;
      })
      .addCase(createPostThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
