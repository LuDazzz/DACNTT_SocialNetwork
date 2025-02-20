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
import { getAllPostByUserID } from "../../redux/post/getPostNewsFeedSlice";


const NewsFeed = () => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const [infoLogger, setInfoLogger] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [posts, setPosts] = useState()

  useEffect(() => {
    //get info logged in user
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: infoLogger.userID })
      );
      setInfoLogger(result.payload);
    };

    //get post for newsfeed
    const fetchAllPost = async () => {
      const result = await dispatch(
        getAllPostByUserID({ userID: infoLogger.userID })
      );
      setPosts(result.payload.$values)
    };

    fetchAllPost()
    fetchUser();
  }, [dispatch]);

  //form new post
  const {
    register: postRegister,
    handleSubmit: postHandleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: { userID: infoLogger.userID },
  });

  //submit post
  const onSubmitPost = async (data) => {
    const result = await dispatch(
      createPostThread({
        userID: infoLogger.userID,
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
            {posts?.map((post) => (
              <Post
                key={post.postID}
                post={post}
                infoLogger={infoLogger}
                toastRef={toastRef}
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
