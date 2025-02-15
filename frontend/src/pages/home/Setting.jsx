// import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout, requestPasscode } from "../../redux/authSlice";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

const Setting = () => {
  const userLoggedInEmail = JSON.parse(localStorage.getItem("user")).email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit } = useForm({
    defaultValues: { email: userLoggedInEmail },
  });

  const onClickResetPass = async (data) => {
    const result = await dispatch(requestPasscode({ email: data.email }));
    if (!result.error) {
      navigate("/confirmpasslogged", { state: { email: data.email } });
    }
  };

  // const onClickResetPass = async (emailReset) => {
  //   const result = await dispatch(requestPasscode({ email: emailReset }));
  //   if ()
  // };

  const onClickLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-80 h-72 bg-white shadow-xl rounded-3xl p-3 gap-5">
          <div
            onClick={handleSubmit(onClickResetPass)}
            className="w-full py-2 border-4 border-cyan-500 rounded-2xl text-center font-bold text-cyan-500 hover:bg-gray-100 hover:cursor-pointer"
          >
            Reset Pass
          </div>
          <div
            onClick={onClickLogout}
            className=" w-full py-2 border-4 border-cyan-500 rounded-2xl text-center font-bold text-cyan-500 hover:bg-gray-100 hover:cursor-pointer"
          >
            Log out
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
