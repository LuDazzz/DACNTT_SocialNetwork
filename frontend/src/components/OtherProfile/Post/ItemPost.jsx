/* eslint-disable react/prop-types */
import "primeicons/primeicons.css";
import { useState, useRef, useEffect, useCallback } from "react";

import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  checkLiked,
  likePost,
  reportPost,
  sharePost,
} from "../../../redux/post/PostActionSlice";
import { getPostByPostID } from "../../../redux/post/postSlice";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { reportSchema } from "../../../utils/yupValidation";
import { yupResolver } from "@hookform/resolvers/yup";

const ItemPost = ({ post, infoLogger, toastRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newPost, setNewPost] = useState(post);
  const [isLiked, setIsLiked] = useState();
  const [showReport, setShowReport] = useState(false);
  const [contentReport, setContentReport] = useState("");

  //Check like
  const isLikedPost = useCallback(async (postId, infoLogger) => {
    const result = await dispatch(
      checkLiked({ userId: infoLogger.userID, postId: postId })
    );
    return result.payload.liked;
  });

  useEffect(() => {
    isLikedPost(newPost?.postID, infoLogger).then((data) => setIsLiked(data));
  }, [isLikedPost, newPost, infoLogger]);

  //Like post
  const likePostAction = async (postId) => {
    const result = await dispatch(
      likePost({ userId: infoLogger.userID, postId: postId })
    );
    const postInfo = await dispatch(getPostByPostID({ postID: post.postID }));
    setNewPost(postInfo.payload);
    isLikedPost(newPost?.postID).then((data) => setIsLiked(data));
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
      return "Yesterday";
    } else {
      return postDate.toLocaleDateString();
    }
  };

  //submit report
  const onSubmitReport = async (data) => {
    const result = await dispatch(
      reportPost({
        postID: data.postID,
        reporterID: data.userID,
        reason: data.reportcontent,
      })
    );

    if (!result.error) {
      toastRef.current.show([
        {
          severity: "success",
          summary: "Success",
          detail: "Admin will consider your report!",
          life: 2000,
        },
      ]);
      setContentReport(null);
    } else {
      toastRef.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: result.payload,
          life: 2000,
        },
      ]);
    }
  };

  //error when report
  const onError = (errors) => {
    if (errors.reportcontent) {
      toastRef.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: errors.reportcontent.message,
          life: 2000,
        },
      ]);
    }
  };

  //share Post
  const onSharePost = async () => {
    const result = await dispatch(
      sharePost({ userID: infoLogger.userID, postID: post.postID })
    );

    if (!result.error) {
      toastRef.current.show([
        {
          severity: "success",
          summary: "Success",
          detail: "Admin will consider your report!",
          life: 2000,
        },
      ]);
    } else {
      toastRef.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: result.payload,
          life: 2000,
        },
      ]);
    }
  };

  //form report
  const {
    register: regRport,
    handleSubmit: handleSubmitReport,
    reset,
  } = useForm({
    defaultValues: { postID: newPost?.postID, userID: infoLogger.userID },
    resolver: yupResolver(reportSchema),
  });

  return (
    <>
      <Toast ref={toastRef} />

      {/* report Post Dialog  */}
      <Dialog
        visible={showReport}
        modal
        draggable={false}
        className="w-1/3 h-fit rounded-xl"
        content={({ hide }) => (
          <form
            onSubmit={handleSubmitReport(onSubmitReport, onError)}
            className="bg-white w-full h-full flex flex-col gap-3 justify-center rounded-xl items-center pb-5"
          >
            <div className="p-5 text-xl font-bold text-cyan-500">
              Report post
            </div>
            <InputTextarea
              {...regRport("reportcontent")}
              id="reporttcontent"
              rows={4}
              value={contentReport}
              onChange={(e) => setContentReport(e.target.value)}
              unstyled
              className="w-4/5 pl-2 border-2 resize-none border-cyan-200 rounded-xl focus:outline-none break-words"
            />
            <div className="w-4/5 gap-5 flex justify-end">
              <div
                onClick={() => setShowReport(false)}
                className="bg-cyan-500 font-bold text-white border-none hover:opacity-80 pt-3 hover:cursor-pointer px-5 rounded-lg"
              >
                <div className="pi pi-times pr-2" />
                Cancel
              </div>
              <Button
                label="Send Report"
                type="submit"
                icon="pi pi-check"
                onClick={() => setShowReport(false)}
                className="bg-green-500 text-white border-none hover:opacity-80"
              />
            </div>
          </form>
        )}
      ></Dialog>

      <div className="flex mt-3 justify-between mx-10">
        {/* user card */}
        <div className="flex justify-center">
          <div className="w-fit h-fit relative">
            <img
              src={`data:image/jpeg;base64,${post.profilePicture}`}
              className="w-9 h-9 rounded-18px border"
            />
            <div
              // onClick={() => onToggleFollow(post.id)}
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
            <div className="font-bold h-full">{post.username}</div>
            <div className="text-gray-500 h-full text-sm">
              {formatDateTime(post.dateTime)}
            </div>
          </div>
          {/* content */}
          <div className="w-full">
            <div className="text-sm">{post.content}</div>
          </div>
          {/* like, cmt, share */}
          <div className="flex gap-10 text-gray-500 text-sm">
            <div
              onClick={() => {
                likePostAction(newPost.postID);
              }}
              className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 hover:cursor-pointer ${
                isLiked ? "text-blue-600 font-bold" : ""
              }`}
            >
              <div className="pi pi-thumbs-up" />
              <div>{newPost.likeCounter ? newPost.likeCounter : "0"}</div>
            </div>
            <Link
              to={`/comment?postId=${post.postID}`}
              query={{ postid: post.postID }}
              className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
            >
              <div className="pi pi-comments" />
              <div>{post.commentCounter}</div>
            </Link>
            <div onClick={onSharePost} className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 hover:cursor-pointer active:scale-95">
              <div className="pi pi-share-alt" />
              <div>{post.shareCounter}</div>
            </div>
          </div>
        </div>
        {/* more info  */}
        <div className="w-fit flex">
          <div
            onClick={() => setShowReport(true)}
            className="pi pi-flag h-fit  rounded-full p-2 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-90"
          />
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ItemPost;
