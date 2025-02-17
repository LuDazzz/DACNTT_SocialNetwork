import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
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
import { editPost } from "../../redux/post/PostActionSlice";

const PostProfile = () => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const [showDeletePost, setshowDeletePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [postlist, setPostList] = useState([]);
  const userLoggedin = JSON.parse(localStorage.getItem("user"));
  const [infoLogger, setInfoLogger] = useState();
  const [editPostID, setEditPostID] = useState();
  const [contentEditPost, setContentEditPost] = useState();

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
    console.log(result);
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
      setPostList(updatedPosts.payload.$values);
    }
    reset();
  };

  const { register: registerEditPost, handleSubmit: handleSubmitEditPost } =
    useForm();

  //Update post
  const onUpdatePost = async (data) => {
    const result = await dispatch(
      editPost({ postID: editPostID, content: data.postcontent })
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
      setPostList(updatedPosts.payload.$values);
    }
  };

  //Error when post empty
  const onError = (errors) => {
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

  console.log("console " + contentEditPost + " va " + editPostID);

  const [isLiked, setIsLiked] = useState(false);
  return (
    <>
      <Toast ref={toastRef} />

      {/* Confirm Delete Dialog */}
      <Dialog
        header="Delete Post"
        visible={showDeletePost}
        style={{ width: "450px" }}
        modal
        onHide={() => setshowDeletePost(false)}
        draggable={false}
        footer={
          <div className="gap-5 flex justify-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setshowDeletePost(false)}
              className="bg-cyan-500 text-white border-none hover:opacity-80"
            />
            <Button
              label="Delete"
              icon="pi pi-check"
              onClick={() => {
                setshowDeletePost(false);
              }}
              className="bg-red-500 text-white border-none hover:opacity-80"
            />
          </div>
        }
      >
        <div className="flex flex-col items-center">
          <div className="text-center">
            Are you sure you want to delete this post?
          </div>
        </div>
      </Dialog>

      {/* Edit Post Dialog  */}
      <form onSubmit={handleSubmitEditPost(onUpdatePost, onError)}>
        <Dialog
          header="Edit Post"
          visible={showEditPost}
          modal
          onHide={() => setShowEditPost(false)}
          draggable={false}
          className="w-1/3 h-1/3"
          footer={
            <div className="gap-5 flex justify-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setShowEditPost(false)}
                className="bg-cyan-500 text-white border-none hover:opacity-80"
              />
              <Button
                label="Update"
                type="submit"
                icon="pi pi-check"
                onClick={() => setShowEditPost(false)}
                className="bg-green-500 text-white border-none hover:opacity-80"
              />
            </div>
          }
        >
          {/* <textarea
            {...registerEditPost("postcontent")}
            id="postcontent"
            value={contentEditPost + " va " + editPostID}
            className="w-full pb-6 pl-2 border-2 resize-none border-cyan-200 rounded-xl focus:outline-none break-words"
          /> */}
          <InputText
            {...registerEditPost("postcontent")}
            id="postcontent"
            value={contentEditPost}
            onChange={(e) => setContentEditPost(e.target.value)}
            unstyled
            className="w-full pb-6 pl-2 border-2 border-cyan-200 rounded-xl focus:outline-none break-words"
          />
        </Dialog>
      </form>

      {/* body  */}
      <div>
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
          {[...postlist].reverse().map((post) => (
            <div key={post.$id}>
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
                    <div className="font-bold h-full text- hover:underline">
                      {post.username}
                    </div>
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
                      // onClick={() => onToggleLike(post.id)}
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 hover:cursor-pointer ${
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
                {/* Delete post  */}
                <div className="w-1/5 flex justify-end relative">
                  <div
                    onClick={() => {
                      setEditPostID(() => {
                        console.log("Giá trị mới:", post.postID);
                        return post.postID;
                      });

                      setContentEditPost(() => {
                        console.log("Nội dung mới:", post.content);
                        return post.content;
                      });
                      setShowEditPost(true);
                    }}
                    className="pi pi-pencil h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-green-500 hover:cursor-pointer active:scale-95"
                  />
                  <div
                    onClick={() => setshowDeletePost(true)}
                    className="pi pi-trash h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-95"
                  />
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostProfile;
