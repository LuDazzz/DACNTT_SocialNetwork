import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { useDispatch } from "react-redux";
import { getUserByUserID } from "../redux/userSlice";
import { useNavigate } from "react-router";

const CommentDetail = ({ comment }) => {
  const dispatch = useDispatch();
  const [infoCommenter, setInfoCommenter] = useState();
  const [infoLogger, setInfoLogger] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const navigate = useNavigate();
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: comment.userID })
      );
      setInfoCommenter(result.payload);
    };

    fetchUser();
  }, [dispatch]);

  //Handle display date time
  const formatDateTime = (isoString) => {
    const postDate = new Date(isoString);
    const now = new Date();
    const diffMs = now - postDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h`;
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return postDate.toLocaleDateString();
    }
  };

  return (
    <>
      <div className="flex mt-3">
        {/* user card */}
        <div className="w-1/6 flex justify-center">
          <div className="w-fit h-fit relative">
            <img
              src={`data:image/jpeg;base64,${infoCommenter?.profilePicture}`}
              className="w-9 h-9 rounded-18px"
            />
            {/* <div
              onClick={() => onToggleFollow(comment.post.id)}
              className={`pi ${
                comment.post.isFollow ? "pi-check" : "pi-plus"
              } bg-black text-white text-10px p-2px h-fit rounded-lg absolute bottom-0 right-0 border-white border-2 hover:cursor-pointer hover:scale-105 active:scale-100`}
            /> */}
          </div>
        </div>
        {/* user post */}
        <div className="w-3/5">
          {/* info */}
          <div className="flex gap-10 items-center">
            <div
              onClick={() => {
                navigate(
                  infoCommenter?.userID === infoLogger.userID
                    ? "/profile"
                    : `/otherprofile/${infoCommenter?.username}/${infoCommenter?.userID}`
                );
              }}
              className="font-bold h-full text- hover:underline hover:cursor-pointer"
            >
              {infoCommenter?.username}
            </div>
            <div className="text-gray-500 h-full text-sm">
              {formatDateTime(comment.dateTime)}
            </div>
          </div>
          {/* content */}
          <div className="text-sm break-words">{comment.content}</div>
          {/* like, cmt, share */}
          <div className="flex gap-10 text-gray-500 text-sm">
            <div
            // onClick={() => onToggleLike(comment.post.id)}
            // className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
            //   comment.post.isLiked ? "text-blue-600 font-bold" : ""
            // }`}
            >
              <div className="pi pi-thumbs-up" />
              <div>{/* {comment.post.likeNum} */}0</div>
            </div>
          </div>
        </div>
        {/* more info  */}
        <div className="w-1/5 flex justify-end items-center">
          <div
            className={`${
              infoCommenter?.userID === infoLogger.userID ? "pi pi-trash" : ""
            } text-red-500 rounded-xl p-2  hover:bg-gray-200`}
          />
        </div>
      </div>
    </>
  );
};

export default CommentDetail;
