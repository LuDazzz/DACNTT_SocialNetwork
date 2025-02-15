import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import postReducer from "../redux/postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
    post: postReducer,
  },
});
