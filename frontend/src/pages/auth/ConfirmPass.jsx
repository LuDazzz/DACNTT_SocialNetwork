import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { confimPassSchema } from "../../utils/yupValidation";
import { useDispatch, useSelector } from "react-redux";
import { confirmPassword } from "../../redux/authSlice";
import { Toast } from "primereact/toast";

function ConfirmPass() {
  // const {isAuthenticated}= useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailForgetPass = location.state?.email;
  const toastRef = useRef(null);

  console.log(emailForgetPass);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: emailForgetPass },
    resolver: yupResolver(confimPassSchema),
  });

  useEffect(() => {
    if (!emailForgetPass) {
      navigate("/login", { replace: true });
    }
  });

  const onSubmit = async (data) => {
    console.log("Submitting for:", location.pathname);

    const result = await dispatch(
      confirmPassword({
        email: data.email,
        resetCode: data.passcode,
        newPassword: data.newpass,
      })
    );

    if (!result.error) {

      toastRef.current?.show([
        {
          severity: "success",
          summary: "Success",
          detail:
            "Password has been changed successfully. We will redirect you to login page",
          life: 2000,
        },
      ]);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } else {
      console.log(toastRef.current);
      toastRef.current?.show([
        {
          severity: "error",
          summary: "Error",
          detail: result.payload,
          life: 2000,
        },
      ]);
    }
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div className="w-full h-screen bg-gradient-to-b from-cyan-500 to-white flex flex-col justify-center items-center">
        <div className="w-96 h-1/2 min-h-96 bg-white rounded-xl shadow-md overflow-auto flex flex-col items-center justify-center">
          <div className="text-cyan-500 font-bold text-2xl">
            Change Password
          </div>
          <div className="text-cyan-500 w-80 text-center text-sm">
            Please enter reset code and new password
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full justify-center items-center">
              <div>
                <InputText
                  {...register("passcode")}
                  id="passcode"
                  unstyled
                  placeholder="Reset Code"
                  className="w-64 mt-3 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
                />
                {errors.passcode && (
                  <p className="pl-2 text-red-600 text-sm">
                    {errors.passcode.message}
                  </p>
                )}
              </div>
              <div>
                <InputText
                  {...register("newpass")}
                  id="newpass"
                  type="password"
                  unstyled
                  placeholder="New Password"
                  className="w-64 mt-3 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
                />
                {errors.newpass && (
                  <p className="pl-2 text-red-600 text-sm">
                    {errors.newpass.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                unstyled
                type="submit"
                label="Confirm Change"
                className="mt-5 p-2 w-56 bg-cyan-400 rounded-lg bottom-5 shadow-sm text-white transition duration-1000 hover:bg-cyan-500"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ConfirmPass;
