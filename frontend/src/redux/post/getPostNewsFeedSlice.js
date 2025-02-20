import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const getAllPostByUserID = createAsyncThunk(
  "getPostByUserID",
  async ({ userID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`posts/getAllPosts/${userID}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const getPostNewsFeedSlice = createSlice({
  name: "postNewsFeed",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create post cases
      .addCase(getAllPostByUserID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPostByUserID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.error = null;
      })
      .addCase(getAllPostByUserID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = getPostNewsFeedSlice.actions;
export default getPostNewsFeedSlice.reducer;