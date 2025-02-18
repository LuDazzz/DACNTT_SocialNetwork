import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  comment: null,
  isLoading: false,
  error: null,
};

export const getComment = createAsyncThunk(
  "getComment",
  async ({ postID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`posts/getCommentListByPostID/${postID}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sendComment = createAsyncThunk(
  "sendComment",
  async ({ postID, userID, content }, { rejectWithValue }) => {
    try {
      const res = await API.post(`posts/comment/${postID}`, {
        userID,
        content,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //get comment cases
      .addCase(getComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.comment = action.payload.comment;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getComment.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { clearError } = commentSlice.actions;
export default commentSlice.reducer;
