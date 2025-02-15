import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { postSchema } from "../../utils/yupValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";
import { createPostThread } from "../../redux/postSlice";
import { useDispatch } from "react-redux";

const PostProfile = () => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const [showDeletePost, setshowDeletePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const userLoggedin = JSON.parse(localStorage.getItem("user"));

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
    }
    reset();
  };

  //Update post
  const onUpdatePost = (data) => {
    console.log(data);
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

  const imgUrl =
    "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip";

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
              onClick={() => setshowDeletePost(false)}
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
      <form>
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
                icon="pi pi-check"
                onClick={() => setShowEditPost(false)}
                className="bg-green-500 text-white border-none hover:opacity-80"
              />
            </div>
          }
        >
          <textarea className="w-full pb-6 pl-2 border-2 resize-none border-cyan-200 rounded-xl focus:outline-none break-words" />
        </Dialog>
      </form>

      {/* body  */}
      <div>
        <form
          onSubmit={handleSubmitPost(onSubmitPost, onError)}
          className="flex items-center justify-start pt-5 border-b-2 pb-4"
        >
          <div className="w-1/6 flex justify-center">
            <img src={imgUrl} className="w-9 h-9 rounded-18px" />
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
          {[1, 2, 3, 4, 5].map((val) => (
            <div key={val}>
              <div className="flex mt-3">
                {/* user card */}
                <div className="w-1/6 flex justify-center">
                  <div className="w-fit h-fit ">
                    <img src={imgUrl} className="w-9 h-9 rounded-18px" />
                  </div>
                </div>
                {/* user post */}
                <div className="w-3/5">
                  {/* info */}
                  <div className="flex gap-10 items-center">
                    <div className="font-bold h-full text- hover:underline">
                      username
                    </div>
                    <div className="text-gray-500 h-full text-sm">4h</div>
                  </div>
                  {/* content */}
                  <div className="w-full">
                    <div className="text-sm">
                      this is content this is content this is contentthis is
                      content this is content this is content this is content
                    </div>
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
                    onClick={() => setShowEditPost(true)}
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
