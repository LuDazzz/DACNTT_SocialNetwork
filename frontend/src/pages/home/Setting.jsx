const Setting = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-80 h-72 bg-white shadow-xl rounded-3xl p-3 gap-5">
          <div className="w-full py-2 border-4 border-cyan-500 rounded-2xl text-center font-bold text-cyan-500 hover:bg-gray-100 hover:cursor-pointer">
            Reset Pass
          </div>
          <div className=" w-full py-2 border-4 border-cyan-500 rounded-2xl text-center font-bold text-cyan-500 hover:bg-gray-100 hover:cursor-pointer">
            Log out
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
