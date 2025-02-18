import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { postSchema } from "../../utils/yupValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";
import { createPostThread, getPostByUserID } from "../../redux/post/postSlice";
import { useDispatch } from "react-redux";
import { getUserByUserID } from "../../redux/userSlice";
import {
  checkLiked,
  deletePost,
  editPost,
  likePost,
} from "../../redux/post/PostActionSlice";
import { InputTextarea } from "primereact/inputtextarea";

const PostProfile = () => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [postlist, setPostList] = useState([]);
  const userLoggedin = JSON.parse(localStorage.getItem("user"));
  const [infoLogger, setInfoLogger] = useState();
  const [editPostID, setEditPostID] = useState();
  const [deletePostID, setDeletePostID] = useState();
  const [contentEditPost, setContentEditPost] = useState();
  const [likePostID, setLikePostID] = useState();

  useEffect(() => {
    //get post list of logged in user
    const fetchPost = async () => {
      const result = await dispatch(
        getPostByUserID({ userID: userLoggedin.userID })
      );
      setPostList(result.payload.$values);
    };
    //get logged in user infomation
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: userLoggedin.userID })
      );
      setInfoLogger(result.payload);
    };

    fetchUser();
    fetchPost();
  }, [dispatch]);

  //form post
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    reset,
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: { userID: userLoggedin.userID },
  });

  // form edit profile
  const { register: registerEditProfile, handleSubmit: handleSubmitProfile } =
    useForm({
      resolver: yupResolver(postSchema),
    });

  //submit post
  const onSubmitPost = async (data) => {
    const result = await dispatch(
      createPostThread({
        userID: userLoggedin.userID,
        content: data.postcontent,
      })
    );
    if (!result.error) {
      toastRef.current.show([
        {
          severity: "success",
          summary: "Success",
          detail: "Post successfully",
          life: 2000,
        },
      ]);
      const updatedPosts = await dispatch(
        getPostByUserID({ userID: userLoggedin.userID })
      );
      setPostList(updatedPosts?.payload.$values);
    }
    reset();
  };

  //form edit post
  const {
    register: registerEditPost,
    handleSubmit: handleSubmitEditPost,
    setValue,
  } = useForm();

  //Update post
  const onUpdatePost = async (data) => {
    const result = await dispatch(
      editPost({ postID: editPostID, content: data.editcontent })
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
      const updatedPosts = await dispatch(
        getPostByUserID({ userID: userLoggedin.userID })
      );
      setPostList(updatedPosts?.payload.$values);
      setShowEditPost(false);
    }
  };

  //Delete post
  const onDeletePost = async (deletePostID) => {
    const result = await dispatch(deletePost({ postID: deletePostID }));
    console.log(result);
    if (!result.error) {
      toastRef.current.show([
        {
          severity: "success",
          summary: "Success",
          detail: "Delete Post successfully",
          life: 2000,
        },
      ]);
      const updatedPosts = await dispatch(
        getPostByUserID({ userID: userLoggedin.userID })
      );
      setPostList(updatedPosts.payload.$values);
      setShowDeletePost(false);
    }
  };

  useEffect(() => {
    setValue("editcontent", contentEditPost);
  }, [contentEditPost, setValue]);

  //Error when post empty
  const onError = (errors) => {
    console.log(1);
    if (errors.postcontent) {
      toastRef.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: errors.postcontent.message,
          life: 2000,
        },
      ]);
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
      return "Yesterday";
    } else {
      return postDate.toLocaleDateString();
    }
  };

  //Check like
  const isLikedPost = async (postId) => {
    console.log("userid and postid " + userLoggedin.userID + " " + postId);
    const result = await dispatch(
      checkLiked({ userId: userLoggedin.userID, postId: postId })
    );
    setIsLiked(result.payload.liked)
    // if (!result.error) {
    //   console.log(result)
    // }
  };

  //Like post
  const likePostAction = async (postId) => {
    const result = await dispatch(
      likePost({ userId: userLoggedin.userID, postId: postId })
    );

    if (result.error) {
      console.log("loi roi")
    }
  };

  const [isLiked, setIsLiked] = useState(true);
  return (
    <>
      <Toast ref={toastRef} />

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
                  onDeletePost(deletePostID);
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

      {/* body  */}
      <div>
        {/* new Post  */}
        <form
          onSubmit={handleSubmitPost(onSubmitPost, onError)}
          className="flex items-center justify-start pt-5 border-b-2 pb-4"
        >
          <div className="w-1/6 flex justify-center">
            <img
              src={`data:image/jpeg;base64,${infoLogger?.profilePicture}`}
              className="w-9 h-9 rounded-18px"
            />
          </div>
          <div className="w-3/5 flex items-center">
            <textarea
              {...registerPost("postcontent")}
              id="postcontent"
              maxLength="150"
              placeholder="Post what you want!"
              rows="2"
              className="text-sm w-full h-full text-gray-400 bg-gray focus:outline-none resize-none placeholder:leading-10 focus:placeholder:text-white"
            />
          </div>
          <div className="w-1/5 flex justify-end">
            <Button
              label="Post"
              type="submit"
              unstyled
              className="px-3 py-1 text-white bg-cyan-400 rounded-xl cursor-pointer"
            />
          </div>
        </form>

        {/* post  */}
        <div className="h-80 overflow-y-auto">
          {!postlist ? (
            <div className="w-full h-full flex justify-center items-center">
              <div>You dont have any post!</div>
            </div>
          ) : (
            [...postlist].reverse().map((post) => (
              <div key={post.postID}>
                <div className="flex mt-3">
                  {/* user card */}
                  <div className="w-1/6 flex justify-center">
                    <div className="w-fit h-fit ">
                      <img
                        src={`data:image/jpeg;base64,${infoLogger?.profilePicture}`}
                        className="w-9 h-9 rounded-18px"
                      />
                    </div>
                  </div>
                  {/* user post */}
                  <div className="w-3/5">
                    {/* info */}
                    <div className="flex gap-10 items-center">
                      <div className="font-bold h-full ">{post.username}</div>
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
                          console.log(post.postID);
                          setLikePostID(post.postID);
                          setIsLiked(!isLiked);
                          console.log(isLikedPost(post.postID));
                        }}
                        className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 hover:cursor-pointer ${
                          isLiked ? "text-blue-600 font-bold" : ""
                        }`}
                      >
                        <div className="pi pi-thumbs-up" />
                        <div>{post.LikeCounter ? post.LikeCounter : "0"}</div>
                      </div>
                      <Link
                        to={`/comment?postId=${post.postID}`}
                        query={{ postid: post.postID }}
                        className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
                      >
                        <div className="pi pi-comments" />
                        <div>
                          {post.CommentCounter ? post.CommentCounter : "0"}
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                        <div className="pi pi-share-alt" />
                        <div>{post.ShareCounter ? post.ShareCounter : "0"}</div>
                      </div>
                    </div>
                  </div>
                  {/* Edit and Delete  */}
                  <div className="w-1/5 flex justify-end">
                    <div
                      onClick={() => {
                        setEditPostID(() => {
                          return post.postID;
                        });

                        setContentEditPost(() => {
                          return post.content;
                        });
                        setShowEditPost(true);
                      }}
                      className="pi pi-pencil h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-green-500 hover:cursor-pointer active:scale-95"
                    />
                    <div
                      onClick={() => {
                        setDeletePostID(post.postID);
                        setShowDeletePost(true);
                      }}
                      className="pi pi-trash h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-95"
                    />
                  </div>
                </div>
                <Divider />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PostProfile;
