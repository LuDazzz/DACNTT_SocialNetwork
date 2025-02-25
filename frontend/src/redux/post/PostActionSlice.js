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
  async ({ postID, reporterID, reason }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `posts/report/${postID}`,
        { reporterID, reason },
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

export const likePost = createAsyncThunk(
  "likePost",
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `posts/like/${postId}`,
        { userId },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const checkLiked = createAsyncThunk(
  "checkLiked",
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "posts/HasLiked",
        { postId, userId },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sharePost = createAsyncThunk(
  "sharePost",
  async ({ postID, userID }, { rejectWithValue }) => {
    try {
      const res = await API.post(`posts/share/${postID}`, { userID });
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
      })

      //report case
      .addCase(reportPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reportPost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(reportPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //share case
      .addCase(sharePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sharePost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sharePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = postActionSlice.actions;
export default postActionSlice.reducer;
