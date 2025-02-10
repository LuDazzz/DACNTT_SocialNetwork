import { Outlet } from "react-router";
import "primeicons/primeicons.css";
import { Link, NavLink } from "react-router";

const LayoutNav = () => {
  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-cyan-500 to-white flex">
        <div className="h-full w-16 shadow-2xl bg-white">
          <Link
            to="/"
            className="w-full pt-5 mb-40 flex justify-center text-2xl italic font-bold font-sans text-cyan-500 hover:tracking-wider hover:text-cyan-600 hover:scale-110 transition"
          >
            DT
          </Link>
          <div className="flex flex-col items-center gap-4">
            <NavLink
              to="/"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "#0097A7",
                      fontWeight: "bold",
                      backgroundColor: "#EEEEEE",
                    }
                  : {};
              }}
              className="pi pi-home w-3/4 py-3 text-center text-2xl text-cyan-500 rounded-md hover:bg-gray-300 hover:scale-110 active:text-cyan-200 active:scale-100"
            />
            <NavLink
              to="/search"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "#0097A7",
                      fontWeight: "bold",
                      backgroundColor: "#EEEEEE",
                    }
                  : {};
              }}
              className="pi pi-search w-3/4 py-3 text-center text-2xl text-cyan-500 rounded-md hover:bg-gray-300 hover:scale-110 active:text-cyan-200 active:scale-100"
            />
            <NavLink
              to="/messenger"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "#0097A7",
                      fontWeight: "bold",
                      backgroundColor: "#EEEEEE",
                    }
                  : {};
              }}
              className="pi pi-comment w-3/4 py-3 text-center text-2xl text-cyan-500 rounded-md hover:bg-gray-300 hover:scale-110 active:text-cyan-200 active:scale-100"
            />
            <NavLink
              to="/notification"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "#0097A7",
                      fontWeight: "bold",
                      backgroundColor: "#EEEEEE",
                    }
                  : {};
              }}
              className="pi pi-bell w-3/4 py-3 text-center text-2xl text-cyan-500 rounded-md hover:bg-gray-300 hover:scale-110 active:text-cyan-200 active:scale-100"
            />
            <NavLink
              to="/profile"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "#0097A7",
                      fontWeight: "bold",
                      backgroundColor: "#EEEEEE",
                    }
                  : {};
              }}
              className="pi pi-user w-3/4 py-3 text-center text-2xl text-cyan-500 rounded-md hover:bg-gray-300 hover:scale-110 active:text-cyan-200 active:scale-100"
            />
            <NavLink
            to="/setting"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "#0097A7",
                      fontWeight: "bold",
                      backgroundColor: "#EEEEEE",
                    }
                  : {};
              }}
              className="pi pi-cog mt-40 w-3/4 py-3 text-center text-2xl text-cyan-500 rounded-md hover:bg-gray-300 hover:scale-110 active:text-cyan-200 active:scale-100"
            />
          </div>
        </div>
        <div className="w-full flex">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LayoutNav;
