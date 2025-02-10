import { Button } from "primereact/button";

function FriendReqNoti() {
  return (
    <>
      <div className="mt-3">
        {[1, 2, 3, 4].map((val) => (
          <div key={val} className=" flex border p-2 rounded-xl justify-between my-2">
            <div className="flex gap-3 w-4/5">
              <div className="w-fit h-fit">
                <img
                  src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                  className="h-9 w-9 rounded-18px"
                />
              </div>
              <div className="">
                <div className="flex mb-3">
                  <div className="font-bold hover:underline hover:cursor-pointer">
                    username
                  </div>
                  <div>&nbsp;has sent you a friend request!</div>
                </div>
                <div className="flex gap-5 text-sm font-semibold">
                  <div>
                    <Button
                      label="Accept"
                      unstyled
                      className="bg-cyan-500 text-white px-4 py-2 rounded-xl active:scale-95"
                    />
                  </div>
                  <div>
                    <Button
                      label="Reject"
                      unstyled
                      className="bg-gray-500 text-white px-4 py-2 rounded-xl active:scale-95"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-gray-500">4h</div>
            </div>
            <div className="flex items-center">
              <div className="pi pi-ellipsis-h text-sm p-1 rounded-xl hover:bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default FriendReqNoti;
