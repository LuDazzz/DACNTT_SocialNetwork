// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstances";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user.email));
      return res.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk để đăng ký
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { username, password, firstName, lastName, email, gender, dob },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post(
        "auth/register",
        { username, password, firstName, lastName, email, gender, dob },
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

// Async thunk để đăng xuất
// export const logout = createAsyncThunk(
//   "auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       await API.post(
//         "auth/logout",
//         {},
//         {
//           withCredentials: true,
//         }
//       );
//       localStorage.removeItem("user")
//       return null;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const requestPasscode = createAsyncThunk(
  "auth/reset-password-request",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "auth/reset-password-request",
        { email },
        { withCredentials: true }
      );
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const confirmPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ email, resetCode, newPassword }, { rejectWithValue }) => {
    try {
      const res = await API.post("auth/reset-password", {
        email,
        resetCode,
        newPassword,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
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
