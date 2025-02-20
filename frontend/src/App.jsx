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
import AuthRoute from "./components/AuthRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute";
import AdminHome from "./pages/admin/adminHome";
import ReportList from "./components/Admin/ReportList";
import UserList from "./components/Admin/UserList";
import PostList from "./components/Admin/PostList";
import OtherProfile from "./pages/home/OtherProfile";
import OtherProfileFriend from "./components/OtherProfile/Friend/OtherProfileFriend";
import OtherProfilePost from "./components/OtherProfile/Post/OtherProfilePost"
import OtherProfileShare from "./components/OtherProfile/Share/OtherProfileShare"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Admin Route  */}
          <Route
            path="/admin"
            element={
              // <AdminRoute>
              <AdminHome />
              // </AdminRoute>
            }
          >
            <Route index element={<ReportList />} />
            <Route path="/admin/userlist" element={<UserList />} />
            <Route path="/admin/postlist" element={<PostList />} />
          </Route>
          {/* Auth Route  */}
          <Route
            path="/"
            element={
              <AuthRoute>
                <LayoutNav />
              </AuthRoute>
            }
          >
            <Route index element={<NewsFeed />} />
            <Route path="/confirmpasslogged" element={<ConfirmPass />} />
            <Route path="/messenger" element={<Messenger />} />
            <Route path="/otherprofile/:username/:userID" element={<OtherProfile/>}>
              <Route index element={<OtherProfilePost/>}/>
              <Route path="/otherprofile/:username/:userID/shared" element={<OtherProfileShare/>}/>
              <Route path="/otherprofile/:username/:userID/friend" element={<OtherProfileFriend/>}/>
            </Route>
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
          {/* Public Route  */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/forgetpass"
            element={
              <PublicRoute>
                <ForgetPass />
              </PublicRoute>
            }
          />
          <Route
            path="/confirmpass"
            element={
              <PublicRoute>
                <ConfirmPass />
              </PublicRoute>
            }
          />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
