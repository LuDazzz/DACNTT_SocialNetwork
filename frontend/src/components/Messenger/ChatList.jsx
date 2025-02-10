const ChatList = () => {
  return (
    <>
      <div className="flex flex-col h-full py-2 overflow-auto">
        {[1, 2, 3, 4].map((val) => (
          <div key={val} className="flex gap-3 p-2 rounded-md hover:bg-gray-300 hover:cursor-pointer">
            <div className="relative w-fit">
              <img src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
              className="h-9 w-9 rounded-full" />
              <div className="rounded-full bg-green-500 w-3 h-3 absolute bottom-0 right-0"/>
            </div>
            <div>
              <div className="flex w-fit">
                <div className="truncate w-32">username</div>
                <div className="text-gray-500 text-center">4h</div>
              </div>
              <div className="text-xs w-44 truncate">content content content content content</div>
            </div>
          </div>
          
        ))}
      </div>
    </>
  );
};

export default ChatList;
