import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassSchema } from "../../utils/yupValidation";
import { Link, useNavigate } from "react-router";
import { Toast } from "primereact/toast";
import { useRef } from "react";

function ForgetPass() {
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPassSchema),
  });

  const toastRef = useRef(null);

  const onError = (errors) => {
    if (errors.email) {
      toastRef.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: errors.email.message,
          life: 2000,
        },
      ]);
    }
  };

  const onSubmit = (data) => {
    toastRef.current.show([
      {
        severity: "success",
        summary: "Successfully",
        detail: "Please check your email to get link reset password!",
        life: 2000,
      },
    ]);
    navigate("/confirmpass");
    console.log(data);
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div className="w-screen h-screen bg-gradient-to-b from-cyan-500 to-white flex flex-col justify-center items-center">
        <div className="w-96 h-1/2 min-h-96 bg-white rounded-xl shadow-md overflow-auto flex flex-col  items-center">
          <div className="mt-20 mb-6 text-3xl text-center">Reset Password</div>
          <div className="px-10 text-xs text-gray-600 text-center">
            Please enter the email address that you used to register, and we
            will send you a link to reset your password via Email.
          </div>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className=" flex flex-col justify-center"
          >
            <InputText
              {...register("email")}
              id="email"
              placeholder="Enter email to reset password"
              className="w-64 h-10 pl-2 mt-5 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
            />
            <div className="flex justify-center">
              <Button
                label="Send"
                type="submit"
                unstyled
                className="mt-5 p-2 w-56 bg-cyan-400 rounded-lg bottom-5 shadow-sm text-white transition duration-1000 hover:bg-cyan-500"
              />
            </div>
            <div className="text-center mt-3 text-xs">
              Return to{" "}
              <Link to="/login" className="text-cyan-500 italic">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgetPass;
