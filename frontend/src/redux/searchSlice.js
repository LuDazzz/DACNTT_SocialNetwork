import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/axiosInstances";
import { cleanError } from "./profPicSlice";

const initialState = {
  user: [],
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        cleanError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
    }
})

export const {clearError} = searchSlice.actions
export default searchSlice.reducer
