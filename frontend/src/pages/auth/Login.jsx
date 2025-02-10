import { InputText } from "primereact/inputtext";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { userLoginSchema } from "../../utils/yupValidation";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userLoginSchema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-cyan-500 to-white flex flex-col justify-center items-center">
        <div className="w-96 h-1/2 min-h-96 bg-white rounded-xl shadow-md overflow-auto">
          <div className="w-full text-center mt-10 py-4 font-bold italic text-lg text-cyan-500">
            Welcome to DTZone
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-3 flex flex-col items-center"
          >
            <div className="">
              <InputText
                {...register("username")}
                id="username"
                placeholder="Username"
                className="w-64 mt-3 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
              />
              {errors.username && (
                <p className="pl-2 text-red-600 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <InputText
                {...register("password")}
                id="password"
                type="password"
                placeholder="Password"
                className="w-64 mt-3 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
              />
              {errors.password && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="w-64 mt-2">
              <Link
                to="/forgetpass "
                className="text-sm  text-cyan-500 float-right"
              >
                Forget Password?
              </Link>
            </div>
            <div>
              <Button
                label="Login to DTZone ->"
                unstyled
                className="mt-5 p-2 w-56 bg-cyan-400 rounded-lg bottom-5 shadow-sm text-white transition duration-1000 hover:bg-cyan-500"
              />
            </div>
            <div className="mt-5 text-sm">
              You don't have an account? Let's
              <Link to="/signup" className="text-cyan-500 italic">
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
