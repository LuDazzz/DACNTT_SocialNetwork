import "primeicons/primeicons.css";
import { useState, useRef, useEffect } from "react";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Link } from "react-router";

const Post = ({ post, onToggleLike, onToggleFollow }) => {
  //handle menu open/close
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisiblePostId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [visiblePostId, setVisiblePostId] = useState(null);

  //item for menu
  const itemPostMoreInfo = [
    { label: "Report this post", command: () => onClickReport(visiblePostId) },
  ];

  //report post
  const toastRef = useRef(null);
  const onClickReport = (postid) => {
    toastRef.current.show([
      {
        severity: "success",
        summary: "Report successfully",
        detail: `Admin will consider your report! ${postid}`,
        life: 2000,
      },
    ]);
    console.log(postid);
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div key={post.id} className="flex mt-3 justify-between mx-10">
        {/* user card */}
        <div className="flex justify-center">
          <div className="w-fit h-fit relative">
            <img src={post.imgurl} className="w-9 h-9 rounded-18px" />
            <div
              onClick={() => onToggleFollow(post.id)}
              className={`pi ${
                post.isFollow ? "pi-check" : "pi-plus"
              } bg-black text-white text-10px p-2px h-fit rounded-lg absolute bottom-0 right-0 border-white border-2 hover:cursor-pointer hover:scale-105 active:scale-100`}
            />
          </div>
        </div>
        {/* user post */}
        <div className="w-4/5">
          {/* info */}
          <div className="flex gap-10 items-center">
            <div className="font-bold h-full text- hover:underline">
              {post.username}
            </div>
            <div className="text-gray-500 h-full text-sm">{post.time}</div>
          </div>
          {/* content */}
          <div className="w-full">
            <div className="text-sm">{post.content}</div>
          </div>
          {/* like, cmt, share */}
          <div className="flex gap-10 text-gray-500 text-sm">
            <div
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
                post.isLiked ? "text-blue-600 font-bold" : ""
              }`}
            >
              <div className="pi pi-thumbs-up" />
              <div>{post.likeNum}</div>
            </div>
            <Link
              to={`/comment?postId=${post.id}`} 
              query={{ postid: post.id }}
              className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
            >
              <div className="pi pi-comments" />
              <div>{post.cmtNum}</div>
            </Link>
            <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
              <div className="pi pi-share-alt" />
              <div>{post.shareNum}</div>
            </div>
          </div>
        </div>
        {/* more info  */}
        <div className="w-fit flex relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setVisiblePostId(visiblePostId === post.id ? null : post.id);
            }}
            className="pi pi-ellipsis-h h-fit  rounded-xl p-1  hover:bg-gray-200"
          />
          {/* more info menu  */}
          {visiblePostId === post.id && (
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
          )}
        </div>
      </div>
      <Divider />
    </>
  );
};

export default Post;
