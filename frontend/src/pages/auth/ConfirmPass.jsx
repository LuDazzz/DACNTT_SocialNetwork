import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function ConfirmPass() {
  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-cyan-500 to-white flex flex-col justify-center items-center">
        <div className="w-96 h-1/2 min-h-96 bg-white rounded-xl shadow-md overflow-auto flex flex-col items-center justify-center">
          <div className="text-black">
            Please enter passcode and new password to reset
          </div>
          <form className="">
            <div className="flex flex-col w-full justify-center items-center">
              <InputText
                id="passcode"
                unstyled
                placeholder="passcode"
                className="w-64 mt-3 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
              />
              <InputText
                id="newpass"
                unstyled
                placeholder="New Password"
                className="w-64 mt-3 h-10 pl-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-200 focus:border-cyan-500"
              />
            </div>
            <div className="flex justify-center">
              <Button
                unstyled
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
