import { Button } from "primereact/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Post from "../../components/Post";
import { postSchema } from "../../utils/yupValidation";
import { yupResolver } from "@hookform/resolvers/yup";

const NewsFeed = () => {
  const [posts, setPost] = useState([
    {
      id: 1,
      imgurl:
        "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
      username: "dat1",
      time: "4h",
      content: "datatatatatatattatatatatatatatatatata atatat tat at at at a",
      likeNum: 2,
      cmtNum: 3,
      shareNum: 3,
      isLiked: false,
      isFollow: false,
    },
    {
      id: 2,
      imgurl:
        "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
      username: "dat2",
      time: "4h",
      content:
        "datatatatatatattatatatatatatatatatata atatat tat at at at aaaaaaaaaaaaaaaaaaaaaaaaaaaaa       dadasdas das dasdas",
      likeNum: 2,
      cmtNum: 3,
      shareNum: 3,
      isLiked: false,
      isFollow: false,
    },
  ]);

  const [userInfo, setUserInfo] = useState({
    userid: 1,
    imgUrl:
      "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
  });

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(postSchema) });

  const onSubmit = (data) => console.log(data);

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          <p>NewsFeed</p>
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl overflow-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-between pt-5 pb-4 mx-10 "
          >
            <div className="w-fit flex justify-center">
              <img src={userInfo.imgUrl} className="w-9 h-9 rounded-18px" />
            </div>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="flex w-full h-full"> */}
            <div className="w-4/5 flex items-center">
              <textarea
                {...register("contentpost")}
                id="contentpost"
                maxLength="150"
                placeholder="Post what you want!"
                rows="2"
                className="text-sm w-full text-gray-400 bg-gray focus:outline-none resize-none border pl-3"
              />
            </div>
            <div className="">
              <Button
                label="Post"
                unstyled
                className="px-3 py-1 text-white bg-cyan-400 rounded-xl cursor-pointer"
              />
            </div>
            {/* </form> */}
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
