// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstances";

const initialState = {
  users: null,
  isLoading: false,
  error: null,
};

// export const getFriendList = createAsyncThunk(
//   "api-link",
//   async ({ userId }, { rejectWithValue }) => {
//     try {
//       const res = await API.get(`/api-link/${userId}`, {
//         withCredentials: true,
//       });
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const getUserByUserID = createAsyncThunk(
  "getUserByUserID",
  async ({ userID }, { rejectWithValue }) => {
    try {
      const res = await API.get(`auth/getUserById/${userID}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get friend list cases
      .addCase(getUserByUserID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserByUserID.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.users = action.payload.users;
      })
      .addCase(getUserByUserID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
