import { Button } from "primereact/button";
import { useState } from "react";
import { Link } from "react-router";

const PostProfile = () => {
  const imgUrl =
    "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip";

  const [isLiked, setIsLiked] = useState(false);
  return (
    <>
      <div>
        <form className="flex items-center justify-start pt-5 border-b-2 pb-4">
          <div className="w-1/6 flex justify-center">
            <img src={imgUrl} className="w-9 h-9 rounded-18px" />
          </div>
          <div className="w-3/5 flex items-center">
            <textarea
              maxLength="150"
              placeholder="Post what you want!"
              rows="2"
              className="text-sm w-full h-full text-gray-400 bg-gray focus:outline-none resize-none placeholder:leading-10 focus:placeholder:text-white"
            />
          </div>
          <div className="w-1/5 flex justify-end">
            <Button
              label="Post"
              unstyled
              className="px-3 py-1 text-white bg-cyan-400 rounded-xl cursor-pointer"
            />
          </div>
        </form>
        {/* post  */}
        <div className="flex mt-3">
          {/* user card */}
          <div className="w-1/6 flex justify-center">
            <div className="w-fit h-fit ">
              <img src={imgUrl} className="w-9 h-9 rounded-18px" />
            </div>
          </div>
          {/* user post */}
          <div className="w-3/5">
            {/* info */}
            <div className="flex gap-10 items-center">
              <div className="font-bold h-full text- hover:underline">
                username
              </div>
              <div className="text-gray-500 h-full text-sm">4h</div>
            </div>
            {/* content */}
            <div className="w-full">
              <div className="text-sm">
                this is content this is content this is contentthis is content
                this is content this is content this is content
              </div>
            </div>
            {/* like, cmt, share */}
            <div className="flex gap-10 text-gray-500 text-sm">
              <div
                // onClick={() => onToggleLike(post.id)}
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
                  isLiked ? "text-blue-600 font-bold" : ""
                }`}
              >
                <div className="pi pi-thumbs-up" />
                <div>1</div>
              </div>
              <Link
                // to={`/comment?postId=${post.id}`}
                // query={{postid: post.id}}
                className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
              >
                <div className="pi pi-comments" />
                <div>1</div>
              </Link>
              <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                <div className="pi pi-share-alt" />
                <div>1</div>
              </div>
            </div>
          </div>
          {/* more info  */}
          <div className="w-1/5 flex justify-end relative">
            <div
              // onClick={(e) => {
              //   e.stopPropagation();
              //   setVisiblePostId(visiblePostId === post.id ? null : post.id);
              // }}
              className="pi pi-ellipsis-h h-fit  rounded-xl p-1  hover:bg-gray-200"
            />
            {/* more info menu  */}
            {/* {visiblePostId === post.id && (
              <div
                ref={menuRef}
                className="absolute bg-white shadow-lg rounded-xl border-gray-300 border p-2 top-3 right-5"
              >
                <Menu
                  unstyled
                  model={itemPostMoreInfo}
                  className="text-gray-500 w-40 text-center p-2 hover:bg-gray-200 rounded-xl"
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostProfile;
