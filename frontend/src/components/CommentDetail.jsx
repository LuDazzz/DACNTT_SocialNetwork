import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { Divider } from "primereact/divider";

const CommentDetail = ({ comment }) => {
  const [visibleCmtId, setVisibleCmtId] = useState(false);

  const itemPostMoreInfo = [
    { label: "Report this post", command: () => onClickReport(visibleCmtId) },
  ];

  const toastRef = useRef(null);
  const onClickReport = (postid) => {
    toastRef.current.show([
      {
        severity: "success",
        summary: "Report successfully",
        detail: "Admin will consider your report!",
        life: 2000,
      },
    ]);
  };

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisibleCmtId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Toast ref={toastRef} />
      <div className="flex mt-3">
        {/* user card */}
        <div className="w-1/6 flex justify-center">
          <div className="w-fit h-fit relative">
            <img src={comment.post.imgurl} className="w-9 h-9 rounded-18px" />
            <div
              // onClick={() => onToggleFollow(comment.post.id)}
              className={`pi ${
                comment.post.isFollow ? "pi-check" : "pi-plus"
              } bg-black text-white text-10px p-2px h-fit rounded-lg absolute bottom-0 right-0 border-white border-2 hover:cursor-pointer hover:scale-105 active:scale-100`}
            />
          </div>
        </div>
        {/* user post */}
        <div className="w-3/5">
          {/* info */}
          <div className="flex gap-10 items-center">
            <div className="font-bold h-full text- hover:underline">
              {comment.post.username}
            </div>
            <div className="text-gray-500 h-full text-sm">
              {comment.post.time}
            </div>
          </div>
          {/* content */}
          <div className="text-sm break-words">{comment.content}</div>
          {/* like, cmt, share */}
          <div className="flex gap-10 text-gray-500 text-sm">
            <div
              // onClick={() => onToggleLike(comment.post.id)}
              className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
                comment.post.isLiked ? "text-blue-600 font-bold" : ""
              }`}
            >
              <div className="pi pi-thumbs-up" />
              <div>{comment.post.likeNum}</div>
            </div>
          </div>
        </div>
        {/* more info  */}
        <div className="w-1/5 flex justify-end relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setVisibleCmtId(
                visibleCmtId === comment.post.id ? null : comment.post.id
              );
            }}
            className="pi pi-ellipsis-h h-fit  rounded-xl p-1  hover:bg-gray-200"
          />
          {/* more info menu  */}
          {visibleCmtId === comment.post.id && (
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

export default CommentDetail;
