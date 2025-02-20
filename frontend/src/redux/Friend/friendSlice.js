import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axiosInstances";

const initialState = {
  friends: [],
  isLoading: false,
  error: null,
};

export const sendFriendRequest = createAsyncThunk(
  "sendFriendRequest",
  async ({ senderID, receiverID }, { rejectWithValue }) => {
    try {
      const res = await API.post("friends/send", { senderID, receiverID });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const checkIsFriend = createAsyncThunk(
  "checkIsFriend",
  async ({ userID1, userID2 }, { rejectWithValue }) => {
    try {
      const res = await API.post("friends/isFriend", { userID1, userID2 });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getFriendListByUserID = createAsyncThunk(
  "getFriendListByUserID",
  async ({ userID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`auth/getFriendByUserId/${userID}`);
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = friendSlice.actions;
export default friendSlice.reducer;
