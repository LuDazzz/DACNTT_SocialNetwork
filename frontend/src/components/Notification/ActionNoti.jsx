import "primeicons/primeicons.css";

function ActionNoti() {
  return (
    <>
      <div className="mt-3">
        {[1, 2, 3, 4].map((val) => (
          <div key={val} className=" flex border p-2 rounded-xl gap-3 my-2">
            <div className="w-fit h-fit">
              <img
                src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                className="h-9 w-9 rounded-18px"
              />
            </div>
            <div className="flex w-full my-3 h-full items-center">
              <div className="flex w-4/5">
                <div className="font-bold hover:underline hover:cursor-pointer">
                  username
                </div>
                <div>&nbsp;has interacted your post! </div>
              </div>
              <div className="text-gray-500 pl-5">4h</div>
            </div>
            <div className="flex items-center">
              <div className="pi pi-trash text-sm p-1 rounded-xl hover:bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ActionNoti;
