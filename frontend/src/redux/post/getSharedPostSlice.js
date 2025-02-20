import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const getSharedPostByUserID = createAsyncThunk(
  "getSharedPostByUserID",
  async ({ userID }, { rejectWithValue }) => {
    try {
      const res = await API.delete(`user/getSharedPosts?userID=${userID}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const getSharedPostSlice = createSlice({
  name: "getSharedPost",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSharedPostByUserID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSharedPostByUserID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.error = null;
      })
      .addCase(getSharedPostByUserID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = getSharedPostSlice.actions;
export default getSharedPostSlice.reducer;
