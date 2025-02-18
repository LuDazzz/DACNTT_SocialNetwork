import "primeicons/primeicons.css";
import { Link } from "react-router";
import { useRef, useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import { useSearchParams } from "react-router";
import CommentDetail from "../../components/CommentDetail";
import { Divider } from "primereact/divider";
import { useDispatch } from "react-redux";
import { getPostByPostID } from "../../redux/post/postSlice";
import { InputTextarea } from "primereact/inputtextarea";
import "primeicons/primeicons.css";
import { getComment, sendComment } from "../../redux/Comment/commentSlice";
import { useForm } from "react-hook-form";

const commentArr = [
  {
    cmtid: 1,
    userid: 1,
    content: "Tôi nè bạn",
    post: {
      id: 1,
      imgurl:
        "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
      username: "521h0441",
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
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const postid = searchParams.get("postId");
  const toastRef = useRef(null);
  const [postInfo, setPostInfo] = useState();
  const userLoggedin = JSON.parse(localStorage.getItem("user"));
  const [commentList, setCommentList] = useState();

  useEffect(() => {
    const getPostInfo = async () => {
      const result = await dispatch(getPostByPostID({ postID: postid }));
      if (!result.error) {
        setPostInfo(result.payload);
      }
    };
    const getCommentByPostID = async () => {
      const result = await dispatch(getComment({ postID: postid }));
      if (!result.error) {
        setCommentList(result.payload.$values);
      }
    };

    getCommentByPostID();
    getPostInfo();
  }, [dispatch, postid]);

  //Post a Comment useForm
  const {
    register: sendCommentReg,
    handleSubmit: sendCommentHandleSubmit,
    reset,
  } = useForm();

  const onSendCommentSubmit = async (data) => {
    const result = await dispatch(
      sendComment({
        postID: postid,
        userID: userLoggedin.userID,
        content: data.contentComment,
      })
    );

    if (!result.error) {
      console.log(result);
      const updateCommentList = await dispatch(getComment({ postID: postid }));
      setCommentList(updateCommentList?.payload.$values);
      reset();
    }
  };

  //Handle display date time
  const formatDateTime = (isoString) => {
    const postDate = new Date(isoString);
    const now = new Date();
    const diffMs = now - postDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h`;
    } else if (diffHours < 48) {
      return "1Day";
    } else {
      return postDate.toLocaleDateString();
    }
  };

  //Check is the owner of Post
  const isOwner = () => {
    return postInfo?.user.userID === userLoggedin.userID;
  };

  console.log(isOwner());

  return (
    <>
      <Toast ref={toastRef} />
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          <Link to="/" className="pi pi-arrow-left mr-1" />
          <p>Comment</p>
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl overflow-auto flex flex-col justify-between">
          <div>
            {/* main Post  */}
            <div className="border rounded-xl">
              <div className="w-full h-fit px-4 pt-4 flex justify-between items-center">
                <div className="flex">
                  <img
                    src={`data:image/jpeg;base64,${postInfo?.user.profilePicture}`}
                    className="w-10 h-10 rounded-18px border"
                  />
                  <div className="w-1/2 ml-5 h-9 flex items-center gap-5">
                    <div className="font-bold">{postInfo?.user.username}</div>
                    <div className="text-gray-500">
                      {formatDateTime(postInfo?.dateTime)}
                    </div>
                  </div>
                </div>

                {/* More action  */}
                <div className="w-1/5 flex justify-end">
                  {isOwner() ? (
                    <>
                      <div className="pi pi-pencil h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-green-500 hover:cursor-pointer active:scale-95" />
                      <div className="pi pi-trash h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-95" />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="px-4">
                <div className="max-h-40 break-words overflow-auto">
                  {postInfo?.content}
                </div>
                {/* Like share cmt  */}
                <div className="flex gap-10 text-gray-500 text-sm pb-1">
                  <div
                    // onClick={() => onToggleLike(postId)}
                    className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
                      // eslint-disable-next-line no-constant-condition
                      false ? "text-blue-600 font-bold" : ""
                    }`}
                  >
                    <div className="pi pi-thumbs-up" />
                    <div>
                      {postInfo?.LikeCounter ? postInfo?.LikeCounter : 0}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                    <div className="pi pi-comments" />
                    <div>
                      {postInfo?.CommentCounter ? postInfo?.LikeCounter : 0}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                    <div className="pi pi-share-alt" />
                    <div>
                      {postInfo?.ShareCounter ? postInfo?.LikeCounter : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* comment list  */}
            <div className="h-500px overflow-auto">
              {/* {commentArr.map((commentItems) => (
                <div key={commentItems.cmtid}>
                  <CommentDetail comment={commentItems} />
                </div>
              ))} */}
              {!commentList ? (
                <div className="h-full flex justify-center items-center">
                  <div>This post doesn&apos;t have comment</div>
                </div>
              ) : (
                commentList?.map((comment) => (
                  <div key={comment.commentID}>
                    <CommentDetail comment={comment} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* send comment  */}
          <div className="w-full h-fit px-5 pb-3">
            <form
              onSubmit={sendCommentHandleSubmit(onSendCommentSubmit)}
              className="w-full h-14 rounded-2xl bg-cyan-500 flex items-center justify-between px-5 shadow-xl"
            >
              <InputTextarea
                {...sendCommentReg("contentComment")}
                id="contentComment"
                placeholder="Comment what you want"
                unstyled
                className="w-11/12 h-10 bg-white rounded-2xl resize-none focus:outline-none px-5 flex placeholder:pt-2"
              />
              <button
                type="submit"
                className=" bg-white h-9 w-9 rounded-full flex justify-center items-center hover:bg-slate-200 hover:cursor-pointer active:scale-90"
              >
                <div className="pi pi-send text-xl" />
              </button>
            </form>
          </div>
          {/* <div>check</div> */}
        </div>
      </div>
    </>
  );
};

export default Comment;
