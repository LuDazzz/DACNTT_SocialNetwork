import "primeicons/primeicons.css";
import { Link } from "react-router";
import { useRef, useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { useSearchParams } from "react-router";
import CommentDetail from "../../components/CommentDetail";
import { Divider } from "primereact/divider";

const commentArr = [
  {
    cmtid: 1,
    userid: 1,
    content: "checkcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheck",
    post: {
      id: 1,
      imgurl:
        "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
      username: "dat1",
      time: "4h",
      content: "datatatatatatattatatatatatatatatatata atatat tat at at at a",
      likeNum: 2,
      cmtNum: 3,
      shareNum: 3,
      isLiked: false,
      isFollow: false,
    },
  },
];

const Comment = () => {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");

  //item for menu
  const itemPostMoreInfo = [
    { label: "Report this post", command: () => onClickReport(visiblePostId) },
  ];

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
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          <Link to="/" className="pi pi-arrow-left mr-1" />
          <p>Comment</p>
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl overflow-auto">
          <div className="w-full h-fit px-4 pt-4 flex justify-between items-center mb-5">
            <div className="flex">
              <img
                src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
                className="w-9 h-9 rounded-18px"
              />
              <div className="w-1/2 ml-5 h-9 flex items-center gap-5">
                <div className="font-bold">username</div>
                <div className="text-gray-500">4h</div>
              </div>
            </div>
            <div className="">
              <div className="w-1/5 flex justify-end relative">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setVisiblePostId(visiblePostId === postId ? null : postId);
                  }}
                  className="pi pi-ellipsis-h h-fit  rounded-xl p-1  hover:bg-gray-200"
                />
                {/* more info menu  */}
                {visiblePostId === postId && (
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
          </div>
          <div className="px-4">
            <div>content content content content content content content</div>
            <div>
              <div className="flex gap-10 text-gray-500 text-sm">
                <div
                  // onClick={() => onToggleLike(postId)}
                  className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
                    // eslint-disable-next-line no-constant-condition
                    false ? "text-blue-600 font-bold" : ""
                  }`}
                >
                  <div className="pi pi-thumbs-up" />
                  <div>1</div>
                </div>
                <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                  <div className="pi pi-comments" />
                  <div>1</div>
                </div>
                <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                  <div className="pi pi-share-alt" />
                  <div>1</div>
                </div>
              </div>
            </div>
          </div>
          <Divider/>
          {/* comment list  */}
          <div>
            {commentArr.map((commentItems) => (
              <div key={commentItems.cmtid}>
                <CommentDetail comment={commentItems} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Comment;
