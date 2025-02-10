import { Button } from "primereact/button";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import "primeicons/primeicons.css";
import { FileUpload } from "primereact/fileupload";

const Profile = () => {
  const [file, setFile] = useState();

  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

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
                  src={
                    file
                      ? file
                      : "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                  }
                  className="rounded-56px h-28 w-28"
                />
                <label className="absolute bottom-0 left-0 cursor-pointer">
                  <i className="pi pi-camera text-2xl border-2 p-1 rounded-2xl border-cyan-500 text-cyan-500 bg-white" />
                  <input
                    type="file"
                    onChange={handleChange}
                    className=" hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col w-3/4 h-3/4 justify-between">
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <div className="text-xl font-bold">Full Name</div>
                  <div className="flex items-center">
                    <div className="text-center">(nickname)</div>
                  </div>
                </div>
                <div>
                  <div>username</div>
                </div>
              </div>
              <div className="p-1 border-2 rounded-2xl overflow-auto">
                this is bio this is bio this is bio this is bio this is bio this
                is bio this is bio this is bio this is bio this is bio this is
                bio this is bio this is bio this is bio this is bio this is bio
                this is bio this is bio this is bio this is bio this
              </div>
              <div className="text-gray-500 text-sm pb-3 hover:underline hover:cursor-pointer">
                3 friends
              </div>
            </div>
            <div className="">
              <Button
                unstyled
                label="Edit Profile"
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

export default Profile;
