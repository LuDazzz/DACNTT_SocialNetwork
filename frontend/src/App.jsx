import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgetPass from "./pages/auth/ForgetPass";
import LayoutNav from "./components/LayoutNav";
import Search from "./pages/home/Search";
import Messenger from "./pages/home/Messenger";
import Notification from "./pages/home/Notification";
import Profile from "./pages/home/Profile";
import Setting from "./pages/home/Setting";
import NewsFeed from "./pages/home/NewsFeed";
import Comment from "./pages/home/Comment";
import PostProfile from "./components/Profile/PostProfile";
import SharedProfile from "./components/Profile/SharedProfile";
import FriendList from "./components/Profile/FriendList";
import UserSearch from "./components/Search/UserSearch";
import PostSearch from "./components/Search/PostSearch";
import ActionNoti from "./components/Notification/ActionNoti";
import FriendReqNoti from "./components/Notification/FriendReqNoti";
import ConfirmPass from "./pages/auth/ConfirmPass";

//default color: cyan

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutNav />}>
            <Route index element={<NewsFeed />} />
            <Route path="/messenger" element={<Messenger />} />
            <Route path="/search" element={<Search />}>
              <Route path="/search/user" element={<UserSearch />} />
              <Route path="/search/post" element={<PostSearch />} />
              <Route
                path="/search"
                element={
                  <div className="w-full h-full flex justify-center items-center">
                    <div>Search for User or Post you want!</div>
                  </div>
                }
              />
            </Route>
            <Route path="/notification" element={<Notification />}>
              <Route index element={<ActionNoti />} />
              <Route
                path="/notification/friendreq"
                element={<FriendReqNoti />}
              />
            </Route>
            <Route path="/profile" element={<Profile />}>
              <Route index path="/profile" element={<PostProfile />} />
              <Route path="/profile/share" element={<SharedProfile />} />
              <Route path="/profile/friend" element={<FriendList />} />
            </Route>
            <Route path="/setting" element={<Setting />} />
            <Route path="/comment" element={<Comment />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetpass" element={<ForgetPass />} />
          <Route path="/confirmpass" element={<ConfirmPass />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
