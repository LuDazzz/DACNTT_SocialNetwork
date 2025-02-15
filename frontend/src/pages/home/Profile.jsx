import { Button } from "primereact/button";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";

const Profile = () => {
  const [file, setFile] = useState();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const userLoggedin = JSON.parse(localStorage.getItem("user"));
  const [checked, setChecked] = useState(false);

  console.log(userLoggedin.IsPriate);

  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      {/* Edit Profile Dialog  */}
      <form>
        <Dialog
          header="Edit Profile"
          visible={showEditProfile}
          onHide={() => setShowEditProfile(false)}
          modal
          draggable={false}
          className="w-1/3 h-fit"
          footer={
            <div className="gap-5 flex justify-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setShowEditProfile(false)}
                className="bg-cyan-500 text-white border-none hover:opacity-80"
              />
              <Button
                label="Update"
                icon="pi pi-check"
                onClick={() => setShowEditProfile(false)}
                className="bg-green-500 text-white border-none hover:opacity-80"
              />
            </div>
          }
        >
          <div className="border-2 w-full p-2 flex flex-col gap-2">
            <div className="flex justify-between">
              <div>Username: </div>
              <InputText
                defaultValue={userLoggedin.username}
                unstyled
                maxLength={20}
                className="w-2/3 border-2 border-cyan-200 p-2 rounded-18px focus:outline-none"
              ></InputText>
            </div>
            <div className="flex justify-between">
              <div>First Name: </div>
              <InputText
                maxLength={30}
                defaultValue={userLoggedin.firstName}
                unstyled
                className="w-2/3 border-2 border-cyan-200 p-2 rounded-18px focus:outline-none"
              ></InputText>
            </div>
            <div className="flex justify-between">
              <div>Last Name: </div>
              <InputText
                maxLength={30}
                defaultValue={userLoggedin.lastName}
                unstyled
                className="w-2/3 border-2 border-cyan-200 p-2 rounded-18px focus:outline-none"
              ></InputText>
            </div>
            <div className="flex justify-between">
              <div>Email: </div>
              <InputText
                disabled
                value={userLoggedin.email}
                unstyled
                className="w-2/3 border-2 border-cyan-200 p-2 rounded-18px focus:outline-none hover:cursor-not-allowed"
              ></InputText>
            </div>
            <div className="flex justify-between">
              <div>Date of Birth: </div>
              <InputText
                disabled
                value={"userLoggedin.dob"}
                unstyled
                className="w-2/3 border-2 border-cyan-200 p-2 rounded-18px focus:outline-none hover:cursor-not-allowed"
              ></InputText>
            </div>
            <div className="flex justify-between">
              <div>Bio: </div>
              <textarea
                rows={3}
                defaultValue={"this is bio this is bio this is bio"}
                className="w-2/3 border-2 border-cyan-200 p-2 rounded-18px resize-none focus:outline-none"
              ></textarea>
            </div>
            <div className="flex justify-between">
              <div>Private: </div>
              <div className="">
                <ToggleButton checked={checked} onChange={(e) => setChecked(e.value)}/>
              </div>
            </div>
          </div>
        </Dialog>
      </form>

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
                onClick={() => setShowEditProfile(true)}
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
