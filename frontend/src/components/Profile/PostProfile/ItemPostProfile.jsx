/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { getPostByPostID } from "../../../redux/post/postSlice";
import { useDispatch } from "react-redux";
import { editPost, likePost } from "../../../redux/post/PostActionSlice";

const ItemPostProfile = ({
  post,
  isLikedPost,
  // likePostAction,
  formatDateTime,
  infoLogger,
  onDeletePost,
  // onUpdatePost,
  onError,
  toastRef,
}) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState();
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [contentEditPost, setContentEditPost] = useState();
  const [newPost, setNewPost] = useState(post);
  var userLoggedIn = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPost = async () => {
      const result = await dispatch(
        getPostByPostID({ postID: newPost.postID })
      );
      setNewPost(result.payload);
    };
    fetchPost();

    isLikedPost(newPost.postID).then((data) => setIsLiked(data));

  }, [dispatch]);

  //Like post
  const likePostAction = async (postId) => {
    const result = await dispatch(
      likePost({ userId: userLoggedIn.userID, postId: postId })
    );
    const postInfo = await dispatch(getPostByPostID({ postID: post.postID }));
    setNewPost(postInfo.payload);
    isLikedPost(newPost?.postID).then((data) => setIsLiked(data));
  };

  //form Edit post
  const { register: registerEditPost, handleSubmit: handleSubmitEditPost } =
    useForm({ defaultValues: { editPostID: post.postID } });

  //Edit post
  const onUpdatePost = async (data) => {
    const result = await dispatch(
      editPost({ postID: data.editPostID, content: data.editcontent })
    );
    console.log(result);
    if (!result.error) {
      toastRef.current.show([
        {
          severity: "success",
          summary: "Success",
          detail: "Update Post successfully",
          life: 2000,
        },
      ]);

      const result = await dispatch(
        getPostByPostID({ postID: newPost.postID })
      );
      setNewPost(result.payload);
      setShowEditPost(false);
    }

    console.log(result.error);
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      <Dialog
        visible={showDeletePost}
        style={{ width: "450px" }}
        modal
        draggable={false}
        className="w-fit h-fit bg-white"
        content={({ hide }) => (
          <div className="flex flex-col">
            <div className="flex flex-col items-center p-5">
              <div className="text-center text-xl text-red-500 font-bold">
                Are you sure you want to delete this post?
              </div>
            </div>
            <div className="gap-5 flex justify-center pb-5">
              <div
                // icon="pi pi-times"
                onClick={() => setShowDeletePost(false)}
                className="bg-cyan-500 font-bold text-white border-none hover:opacity-80 pt-3 hover:cursor-pointer px-5 rounded-lg"
              >
                <div className="pi pi-times pr-2" />
                Cancel
              </div>
              <Button
                label="Delete"
                icon="pi pi-check"
                type="submit"
                onClick={() => {
                  onDeletePost(newPost.postID);
                  setShowDeletePost(false);
                }}
                className="bg-red-500 text-white border-none hover:opacity-80"
              />
            </div>
          </div>
        )}
      ></Dialog>

      {/* Edit Post Dialog  */}
      <Dialog
        visible={showEditPost}
        modal
        draggable={false}
        className="w-1/3 h-fit rounded-xl"
        content={({ hide }) => (
          <form
            onSubmit={handleSubmitEditPost(onUpdatePost, onError)}
            className="bg-white w-full h-full flex flex-col gap-3 justify-center rounded-xl items-center pb-5"
          >
            <div className="p-5 text-xl font-bold text-cyan-500">Edit post</div>
            <InputTextarea
              {...registerEditPost("editcontent")}
              id="editcontent"
              rows={4}
              value={contentEditPost}
              onChange={(e) => setContentEditPost(e.target.value)}
              unstyled
              className="w-4/5 pl-2 border-2 resize-none border-cyan-200 rounded-xl focus:outline-none break-words"
            />
            <div className="w-4/5 gap-5 flex justify-end">
              <div
                // icon="pi pi-times"
                onClick={() => setShowEditPost(false)}
                className="bg-cyan-500 font-bold text-white border-none hover:opacity-80 pt-3 hover:cursor-pointer px-5 rounded-lg"
              >
                <div className="pi pi-times pr-2" />
                Cancel
              </div>
              <Button
                label="Update"
                type="submit"
                icon="pi pi-check"
                onClick={() => setShowEditPost(false)}
                className="bg-green-500 text-white border-none hover:opacity-80"
              />
            </div>
          </form>
        )}
      ></Dialog>

      <div className="flex mt-3">
        {/* user card */}
        <div className="w-1/6 flex justify-center">
          <div className="w-fit h-fit ">
            <img
              src={`data:image/jpeg;base64,${infoLogger?.profilePicture}`}
              className="w-9 h-9 rounded-18px border"
            />
          </div>
        </div>
        {/* user post */}
        <div className="w-3/5">
          {/* info */}
          <div className="flex gap-10 items-center">
            <div className="font-bold h-full ">{newPost.user?.username}</div>
            <div className="text-gray-500 h-full text-sm">
              {formatDateTime(newPost.dateTime)}
            </div>
          </div>
          {/* content */}
          <div className="w-full">
            <div className="text-sm">{newPost.content}</div>
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
              to={`/comment?postId=${newPost.postID}`}
              query={{ postid: newPost.postID }}
              className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
            >
              <div className="pi pi-comments" />
              <div>{newPost.commentCounter ? newPost.commentCounter : "0"}</div>
            </Link>
            <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
              <div className="pi pi-share-alt" />
              <div>{newPost.shareCounter ? newPost.shareCounter : "0"}</div>
            </div>
          </div>
        </div>
        {/* Edit and Delete  */}
        <div className="w-1/5 flex justify-end">
          <div
            onClick={() => {
              setContentEditPost(newPost.content);
              setShowEditPost(true);
            }}
            className="pi pi-pencil h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-green-500 hover:cursor-pointer active:scale-95"
          />
          <div
            onClick={() => {
              setShowDeletePost(true);
            }}
            className="pi pi-trash h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-95"
          />
        </div>
      </div>
    </>
  );
};

export default ItemPostProfile;
