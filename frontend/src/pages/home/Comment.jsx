import "primeicons/primeicons.css";
import { Link } from "react-router";
import { useRef, useEffect, useState, useCallback } from "react";
import { Toast } from "primereact/toast";
import { useSearchParams } from "react-router";
import CommentDetail from "../../components/CommentDetail";
import { useDispatch } from "react-redux";
import { getPostByPostID } from "../../redux/post/postSlice";
import { InputTextarea } from "primereact/inputtextarea";
import "primeicons/primeicons.css";
import { getComment, sendComment } from "../../redux/Comment/commentSlice";
import { useForm } from "react-hook-form";
import { checkLiked, likePost } from "../../redux/post/PostActionSlice";

const Comment = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const postid = searchParams.get("postId");
  const toastRef = useRef(null);
  const [postInfo, setPostInfo] = useState();
  const [infoLogger, setInfoLogger] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [commentList, setCommentList] = useState();
  const [isLike, setIsLike] = useState();

  console.log(isLike);

  //Check like
  const isLikedPost = useCallback(async (postId, infoLogger) => {
    const result = await dispatch(
      checkLiked({ userId: infoLogger.userID, postId: postId })
    );
    return result.payload.liked;
  });

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

    isLikedPost(postid, infoLogger).then((data) => setIsLike(data));
    getCommentByPostID();
    getPostInfo();
  }, [dispatch, infoLogger]);

  //Like post
  const likePostAction = async (postId) => {
    const result = await dispatch(
      likePost({ userId: infoLogger.userID, postId: postId })
    );
    const postInfoFetch = await dispatch(
      getPostByPostID({ postID: postInfo?.postID })
    );
    setPostInfo(postInfoFetch.payload);
    isLikedPost(postid, infoLogger).then((data) => setIsLike(data));
  };

  //Post a Comment useForm
  const {
    register: sendCommentReg,
    handleSubmit: sendCommentHandleSubmit,
    reset,
  } = useForm();

  //submit comment
  const onSendCommentSubmit = async (data) => {
    const result = await dispatch(
      sendComment({
        postID: postid,
        userID: infoLogger.userID,
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
    return postInfo?.user.userID === infoLogger.userID;
  };

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
                    onClick={() => likePostAction(postInfo?.postID)}
                    className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 hover:cursor-pointer active:scale-95 ${
                      // eslint-disable-next-line no-constant-condition
                      isLike ? "text-blue-600 font-bold" : ""
                    }`}
                  >
                    <div className="pi pi-thumbs-up" />
                    <div>{postInfo?.likeCounter}</div>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200">
                    <div className="pi pi-comments" />
                    <div>{postInfo?.commentCounter}</div>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 hover:cursor-pointer active:scale-95">
                    <div className="pi pi-share-alt" />
                    <div>{postInfo?.shareCounter}</div>
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
                commentList?.reverse().map((comment) => (
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
