// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  posts: null,
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

export const getPostByUserID = createAsyncThunk(
  "getPostByUserID",
  async ({ userID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`auth/getPostByUserId/${userID}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getPostByPostID = createAsyncThunk(
  "getPostByPostID",
  async ({ postID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`posts/${postID}`);
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
        state.posts = action.payload.posts;
        state.error = null;
      })
      .addCase(createPostThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get post by userID cases
      .addCase(getPostByUserID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostByUserID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(getPostByUserID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //Get post by Post ID cases
      .addCase(getPostByPostID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostByPostID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(getPostByPostID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
