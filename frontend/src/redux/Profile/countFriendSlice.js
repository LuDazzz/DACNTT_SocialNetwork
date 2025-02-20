import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  friendNum: null,
  isLoading: false,
  error: null,
};

export const countFriendByUserID = createAsyncThunk(
  "countFriendByUserID",
  async ({ userID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`friends/count/${userID}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const countFriendSlice = createSlice({
  name: "countFriend",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // delete post cases
      .addCase(countFriendByUserID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(countFriendByUserID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.error = null;
      })
      .addCase(countFriendByUserID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = countFriendSlice.actions;
export default countFriendSlice.reducer;
