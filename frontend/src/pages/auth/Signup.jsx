import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { yupResolver } from "@hookform/resolvers/yup";
import {userRegisterSchema} from "../../utils/yupValidation";
import { RadioButton } from "primereact/radiobutton";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(userRegisterSchema),
  });

  // const onsubmit = async (data) => {
  //   try {
  //     const res = await axios.post("api/register", data);
  //     console.log("OK", res.data);
  //   } catch (e) {
  //     console.error("error", e.res?.data || e.message);
  //   }
  // };

  const onSubmit = (data) => console.log(data);

  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-cyan-500 to-white flex justify-center items-center">
        <div className="w-96 h-3/4 min-h-96 bg-white rounded-xl shadow-md overflow-auto">
          <div className="w-full text-center py-4 font-bold italic text-lg text-cyan-500">
            Register
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <div>
              <InputText
                {...register("username")}
                id="username"
                placeholder="Username"
                keyfilter="alphanum"
                unstyled
                className={errors.username && "border-red-600"}
                pt={{
                  root: {
                    className:
                      "w-72 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500",
                  },
                  label: {
                    className: "text-cyan-600",
                  },
                }}
              />
              {errors.username && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <Password
                {...register("password")}
                id="password"
                feedback={false}
                toggleMask
                placeholder="Password"
                unstyled
                pt={{
                  input: {
                    className:
                      "w-72 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500",
                  },
                  root: {
                    className: "pt-2",
                  },
                }}
                onChange={(e) => setValue("password", e.target.value)}
              />
              {errors.password && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Password
                {...register("confirmpassword")}
                id="confirmpassword"
                feedback={false}
                toggleMask
                placeholder="Confirm your password"
                unstyled
                pt={{
                  input: {
                    className:
                      "w-72 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500",
                  },
                  root: {
                    className: "pt-2",
                  },
                }}
                onChange={(e) => setValue("confirmpassword", e.target.value)}
              />
              {errors.confirmpassword && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.confirmpassword.message}
                </p>
              )}
            </div>
            <div className="">
              <div className="flex w-72 mt-3 space-x-0.5">
                <InputText
                  {...register("firstname")}
                  id="firstname"
                  placeholder="First Name"
                  unstyled
                  pt={{
                    root: {
                      className:
                        "w-1/2 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500",
                    },
                  }}
                />
                <InputText
                  {...register("lastname")}
                  id="lastname"
                  placeholder="Last Name"
                  unstyled
                  pt={{
                    root: {
                      className:
                        "w-1/2 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500",
                    },
                  }}
                />
              </div>
              {errors.firstname && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.firstname.message}
                </p>
              )}
              {errors.lastname && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.lastname.message}
                </p>
              )}
            </div>
            <div className="mt-3">
              <InputText
                {...register("email")}
                id="email"
                placeholder="Email"
                keyfilter="email"
                unstyled
                pt={{
                  root: {
                    className:
                      "w-72 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500",
                  },
                }}
              />
              {errors.email && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-3 w-72">
              <div className="flex space-x-1 gap-10 ">
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="male"
                    name="gender"
                    value="male"
                    {...register("gender")}
                    onChange={(e) => setValue("gender", e.target.value)}
                    checked={watch("gender") === "male"}
                  />
                  <label htmlFor="male" className="ml-2">
                    Male
                  </label>
                </div>
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="female"
                    name="gender"
                    value="female"
                    {...register("gender")}
                    onChange={(e) => setValue("gender", e.target.value)}
                    checked={watch("gender") === "female"}
                  />
                  <label htmlFor="female" className="ml-2">
                    Female
                  </label>
                </div>
              </div>
              {errors.gender && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="mt-3">
              <Calendar
                {...register("dob")}
                id="dob"
                placeholder="Date of birth"
                dateFormat="dd/mm/yy"
                showIcon
                className="h-10 w-72"
                onChange={(e) => {
                  const date = new Date(e.value);
                  const formattedDate = `${String(date.getDate()).padStart(
                    2,
                    "0"
                  )}/${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}/${date.getFullYear()}`;
                  setValue("dob", formattedDate);
                }}
              />
              {errors.dob && (
                <p className="pl-2 text-red-600 text-xs">
                  {errors.dob.message}
                </p>
              )}
            </div>
            <div className="mt-5">
              You have an account? Back to
              <Link to="/login" className="text-cyan-500 italic">
                {" "}
                Login
              </Link>
            </div>
            <Button
              label="Register ->"
              type="submit"
              unstyled
              className="mt-10 p-2 w-64 bg-cyan-400 rounded-lg bottom-5 shadow-sm text-white transition duration-1000 hover:bg-cyan-500"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
