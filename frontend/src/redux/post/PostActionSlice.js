import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  posts: null,
  isLoading: false,
  error: null,
};

export const deletePost = createAsyncThunk(
  "deletePost",
  async ({ postID }, { rejectWithValue }) => {
    try {
      const res = await API.delete(`posts/delete/${postID}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const editPost = createAsyncThunk(
  "editPost",
  async ({ postID, content }, { rejectWithValue }) => {
    try {
      const res = await API.put(
        `posts/edit/${postID}`,
        { content },
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

export const reportPost = createAsyncThunk(
  "reportPost",
  async ({ postID, userID, reason }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `posts/report/${postID}`,
        { userID, reason }, 
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

const postActionSlice = createSlice({
  name: "postAction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // delete post cases
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // edit post cases
      .addCase(editPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.error = null;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = postActionSlice.actions;
export default postActionSlice.reducer;
