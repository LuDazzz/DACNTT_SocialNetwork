import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Post from "../../components/Post";
import { postSchema } from "../../utils/yupValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { createPostThread } from "../../redux/post/postSlice";
import { Toast } from "primereact/toast";
import { getUserByUserID } from "../../redux/userSlice";

const NewsFeed = () => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const userLoggedin = JSON.parse(localStorage.getItem("user"));
  const [infoLogger, setInfoLogger] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: userLoggedin.userID })
      );
      setInfoLogger(result.payload);
    };

    fetchUser();
  }, [dispatch]);

  const {
    register: postRegister,
    handleSubmit: postHandleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: { userID: userLoggedin.userID },
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
    reset();
  };

  //handle error when post empty
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

  const [posts, setPost] = useState([
    {
      id: 1,
      imgurl:
        "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
      username: "dat1",
      time: "4h",
      content: "Trời hôm nay thật đẹp, liệu có ai muốn đi chơi không?",
      likeNum: 2,
      cmtNum: 3,
      shareNum: 1,
      isLiked: false,
      isFollow: false,
    },
  ]);

  // when hit follow
  const handleToggleFollow = (postId) => {
    setPost((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isFollow: !post.isFollow } : post
      )
    );
  };

  //when hit like
  const handleToggleLike = (postId) => {
    setPost((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          <p>NewsFeed</p>
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl overflow-auto">
          <form
            onSubmit={postHandleSubmit(onSubmitPost, onError)}
            className="flex items-center justify-between pt-5 pb-4 mx-10 "
          >
            <div className="w-fit flex justify-center">
              <img
                src={`data:image/jpeg;base64,${infoLogger?.profilePicture}`}
                className="w-9 h-9 rounded-18px border"
              />
            </div>
            <div className="w-4/5 flex items-center">
              <textarea
                {...postRegister("postcontent")}
                id="postcontent"
                maxLength="150"
                placeholder="Post what you want!"
                rows="2"
                className="text-sm w-full text-gray-400 bg-gray focus:outline-none resize-none border pl-3"
              />
            </div>
            <Button
              label="Post"
              type="submit"
              unstyled
              className="px-3 py-1 text-white bg-cyan-400 rounded-xl cursor-pointer"
            />
          </form>
          <div>
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onToggleFollow={handleToggleFollow}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        </div>
      </div>
      <button className="pi pi-calendar text-3xl text-cyan-500 bg-white w-16 h-16 rounded-xl border-2 border-gray-300 absolute bottom-16 right-28 hover:bg-gray-300 active:text-cyan-300 active:scale-95" />
    </>
  );
};
export default NewsFeed;
