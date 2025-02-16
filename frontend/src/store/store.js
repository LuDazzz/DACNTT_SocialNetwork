import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import postReducer from "../redux/post/postSlice";
import postActionReducer from "../redux/post/PostActionSlice";
import userReducer from "../redux/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    postAction: postActionReducer,
    user: userReducer,
  },
});
