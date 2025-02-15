// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstances";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

export const getFriendList = createAsyncThunk(
  "api-link",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api-link/${userId}`, {
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
    //Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Reset Passcode request cases
      .addCase(requestPasscode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasscode.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(requestPasscode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //confirm password cases
      .addCase(confirmPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(confirmPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
