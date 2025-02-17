import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { getUserByUserID } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

const OtherProfile = () => {
  const dispatch = useDispatch();
  const userLoggedin = JSON.parse(localStorage.getItem("user"));
  const [checked, setChecked] = useState(false);
  const [infoUser, setInfoUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: userLoggedin.userID })
      );
      setInfoLogger(result.payload);
    };

    fetchUser();
  }, [dispatch]);

  console.log(infoLogger);

  //Handle display date time
  const formatDateTime = (isoString) => {
    const postDate = new Date(isoString);

    return postDate.toLocaleDateString(); 
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          Profile
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl pt-5">
          <div className="w-full relative h-1/3 px-5">
            <div className="absolute right-5">
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${infoUser?.profilePicture}`}
                  className="rounded-56px h-28 w-28 border"
                />
              </div>
            </div>
            <div className="flex flex-col w-3/4 h-3/4 justify-between">
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <div className="text-xl font-bold">
                    {userLoggedin.lastName} {userLoggedin.firstName}
                  </div>
                </div>
                <div>{userLoggedin.username}</div>
              </div>
              <div className="p-1 h-20 border-2 rounded-2xl overflow-auto">
                this is bio this is bio this is bio this is bio this is bio
              </div>
              <div className="text-gray-500 text-sm pb-3">3 friends</div>
            </div>
            <div className="">
              <Button
                unstyled
                label="Show Profile"
                className="bg-cyan-500 text-white w-full py-2 rounded-xl font-medium"
              />
            </div>
          </div>
          <div className="h-2/3 w-full ">
            <div className="flex">
              <NavLink
                to="/profile"
                end
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/3 py-2 text-center font-semibold text-cyan-300 border-b border-cyan-300 active:text-cyan-200"
              >
                Post
              </NavLink>
              <NavLink
                to="/profile/share"
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/3 py-2 text-center font-semibold text-cyan-300 border-b border-cyan-300 active:text-cyan-200"
              >
                Shared
              </NavLink>
              <NavLink
                to="/profile/friend"
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/3 py-2 text-center font-semibold text-cyan-300 border-b border-cyan-300 active:text-cyan-200"
              >
                Friend List
              </NavLink>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherProfile;
