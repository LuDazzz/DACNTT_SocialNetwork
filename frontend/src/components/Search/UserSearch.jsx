import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

function UserSearch() {
  return (
    <>
      {[1, 2, 3, 4].map((val) => (
        <div key={val}>
          <div className="flex relative w-full h-fit gap-5 box-border overflow-y-hidden">
            <div>
              <img
                src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                className="w-9 h-9 rounded-18px"
              />
            </div>
            <div className="text-sm w-full">
              <div className="flex gap-1">
                <div className="font-bold">username</div>
                <div>(nickname)</div>
              </div>
              <div className="text-gray-400 font-light mb-2">Full Name</div>
              <div>
                Bio Bio Bio Bio Bio BioBio BioBio Bio Bio Bio Bio Bio Bio Bio
                Bio Bio Bio Bio BioBio BioBio Bio Bio Bio Bio Bio Bio
              </div>
            </div>
            <div className="absolute right-0">
              <Button
                unstyled
                label="Send Request"
                className="bg-cyan-500 py-2 px-3 rounded-xl text-sm font-semibold text-white active:scale-95"
              />
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </>
  );
}

export default UserSearch;
