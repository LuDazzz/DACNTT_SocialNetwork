import { Button } from "primereact/button";

const FriendList = () => {
  return (
    <>
      <div className="flex flex-col mx-5 mt-5 gap-5 w-auto h-5/6 overflow-y-auto">
        {[1, 2, 3].map((val) => (
          <div
            key={val}
            className=" flex border p-2 rounded-xl gap-3 justify-between"
          >
            <div className="flex gap-5">
              <div>
                <img
                  src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                  className="h-9 w-9 rounded-18px"
                />
              </div>
              <div className="flex items-center">
                <div className="flex gap-3 items-center h-full">
                  <div className="font-bold">Name</div>
                  <div>username</div>
                </div>
              </div>
            </div>
            <Button
              unstyled
              label="Remove Friend"
              className="text-sm text-white bg-cyan-500 font-semibold px-4 py-2 rounded-18px active:scale-95"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FriendList;
