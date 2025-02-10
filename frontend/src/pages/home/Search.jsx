import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { NavLink, Outlet } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchSchema } from "../../utils/yupValidation";

const Search = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(searchSchema) });

  const onSubmit = (data) => console.log(data);

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          Search
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl overflow-auto">
          {/* search bar */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-10 flex justify-center mt-5"
          >
            <div className="h-full w-4/5 flex relative">
              <InputText
                {...register("searchcontent")}
                id="searchcontent"
                type="search"
                unstyled
                className="w-full h-full flex  rounded-3xl focus:outline-none bg-gray-200 pl-10 pr-28"
              />
              <div className="h-full absolute flex items-center w-10 justify-center">
                <div className="pi pi-search" />
              </div>
              <div className="absolute h-full w-28 flex items-center justify-center right-0 text-sm text-white font-semibold">
                <NavLink to="/search/user" className="rounded-xl">
                  <Button
                    label="Search"
                    type="submit"
                    unstyled
                    className="bg-cyan-500 px-3 py-1 rounded-xl active:scale-95"
                  />
                </NavLink>
              </div>
            </div>
          </form>
          <div className="flex w-fit gap-5 h-10 mt-5 mx-5">
            <NavLink
              to="/search/user"
              end
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "#00BCD4",
                    }
                  : {};
              }}
              className="h-fit px-5 py-1 border-2 rounded-18px font-bold text-cyan-500 border-cyan-500"
            >
              User
            </NavLink>
            <NavLink
              to="/search/post"
              style={({ isActive }) => {
                return isActive
                  ? {
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "#00BCD4",
                    }
                  : {};
              }}
              className="h-fit px-5 py-1 border-2 rounded-18px font-bold text-cyan-500 border-cyan-500"
            >
              Post
            </NavLink>
          </div>
          <div className="mt-5 mx-6">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
