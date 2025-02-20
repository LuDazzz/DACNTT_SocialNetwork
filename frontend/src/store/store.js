import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import postReducer from "../redux/post/postSlice";
import postActionReducer from "../redux/post/PostActionSlice";
import userReducer from "../redux/userSlice";
import commentReducer from "../redux/Comment/commentSlice";
import profPicReducer from "../redux/profPicSlice";
import searchReducer from "../redux/searchSlice";
import postNewsFeedReducer from "../redux/post/getPostNewsFeedSlice";
import countFriendReducer from "../redux/Profile/countFriendSlice";
import getSharedPostReducer from "../redux/post/getSharedPostSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    postAction: postActionReducer,
    user: userReducer,
    comment: commentReducer,
    profPic: profPicReducer,
    search: searchReducer,
    postNewsFeed: postNewsFeedReducer,
    countFriend: countFriendReducer,
    getSharedPost: getSharedPostReducer,
  },
});
