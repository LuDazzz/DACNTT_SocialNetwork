import { NavLink, Outlet } from "react-router";

const Notification = () => {
  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          Notification
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl overflow-auto">
          <div className="mt-5 mx-5">
            <div className="w-full h-fit flex gap-5">
              <NavLink
                to="/notification"
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
                className="w-1/2 border-b-2 text-center py-5 border-cyan-200 text-cyan-500"
              >
                Action
              </NavLink>
              <NavLink
                to="/notification/friendreq"
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/2 border-b-2 text-center py-5 border-cyan-200 text-cyan-500"
              >
                Friend Request
              </NavLink>
            </div>
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
