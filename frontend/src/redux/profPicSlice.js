import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/axiosInstances";

const initialState = {
  pic: null,
  isLoading: false,
  error: null,
};

export const updateProfilePicture = createAsyncThunk(
  "updateProfilePicture",
  async ({ userID, profilePicture }, { rejectWithValue }) => {
    try {
        const res = await API.post("user/update-avatar")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
  }
);

const profPicSlice = createSlice({
  name: "profPic",
  initialState,
  reducers: {
    cleanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { cleanError } = profPicSlice.actions;
export default profPicSlice.reducer;
