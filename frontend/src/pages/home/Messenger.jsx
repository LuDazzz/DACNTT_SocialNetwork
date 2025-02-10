import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ChatList from "../../components/Messenger/ChatList";
import "primeicons/primeicons.css";

const Messenger = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/5 h-9/10 bg-white rounded-3xl shadow-2xl flex items-center justify-center gap-5">
          <div className="h-9/10 w-1/4 bg-cyan-500 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="h-fit w-5/6 rounded-2xl flex items-center">
              <form className="w-full h-10 flex justify-center">
                <div className="h-full w-full flex relative">
                  <InputText
                    id="searchcontent"
                    placeholder="Search"
                    type="search"
                    unstyled
                    className="w-full h-full flex rounded-2xl focus:outline-none bg-white pl-2 pr-10"
                  />
                  <div className="absolute h-full w-fit flex items-center justify-center right-1 text-sm text-white font-semibold">
                    <Button
                      type="submit"
                      unstyled
                      className="pi pi-search bg-cyan-500 py-1 pl-2 rounded-xl active:scale-95"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="h-5/6 w-5/6 bg-white rounded-2xl">
              <ChatList />
            </div>
          </div>
          <div className="h-9/10 w-2/3 rounded-3xl flex flex-col border-cyan-500 bg-white border-8 p-4">
            {/* chat header  */}
            <div className="flex w-full items-center justify-between border-b-2 border-cyan-500 pb-2">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                  className="h-16 w-16 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">Username</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 h-3 w-3 rounded-full" />
                    <div className="text-gray-500 text-sm">Is Online</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 ">
                <div className="pi pi-phone text-2xl text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 hover:cursor-pointer rounded-full" />
                <div className="pi pi-video text-2xl text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 hover:cursor-pointer rounded-full" />
                <div className="pi pi-exclamation-circle text-2xl text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 hover:cursor-pointer rounded-full" />
              </div>
            </div>
            {/* chat body  */}
            <div className="flex flex-col h-500px w-full pt-2">
              <div className="w-full h-9/10">
              {/* chat phia friend  */}
                <div className="flex gap-2 items-center">
                  <img
                    src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                    className="h-9 w-9 rounded-full"
                  />
                  <div className="p-2 max-w-3/4 rounded-2xl bg-black text-white break-words">text</div>
                </div>
                {/* chat phia ban  */}
                <div className="w-full flex justify-end">
                  <div className="p-2 max-w-3/4 rounded-2xl bg-cyan-500 text-white break-words">
                    day la text
                  </div>
                </div>
              </div>
              <div className="flex w-full h-1/10 relative">
                <InputText
                  placeholder="Send message to your friend!"
                  unstyled
                  className="w-full h-full border-4 border-cyan-500 rounded-3xl px-3 focus:outline-none"
                />
                <div className="absolute right-3 h-full flex items-center gap-3 border-l-2 border-cyan-500 pl-2">
                  <div className="pi pi-images text-xl text-cyan-500 rounded-full hover:bg-cyan-500 hover:text-white p-2 hover:cursor-pointer" />
                  <div className="pi pi-microphone text-xl text-cyan-500 rounded-full hover:bg-cyan-500 hover:text-white p-2 hover:cursor-pointer" />
                  <div className="pi pi-map-marker text-xl text-cyan-500 rounded-full hover:bg-cyan-500 hover:text-white p-2 hover:cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
