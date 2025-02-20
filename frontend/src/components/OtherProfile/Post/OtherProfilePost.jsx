import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { InputTextarea } from "primereact/inputtextarea";
import ItemPost from "../Post/ItemPost";
import { getPostByUserID } from "../../../redux/post/postSlice";
import { getUserByUserID } from "../../../redux/userSlice";

const OtherProfilePost = () => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const [postlist, setPostList] = useState([]);
  const [infoLogger, setInfoLogger] = useState(JSON.parse(localStorage.getItem("user")));
  const {  userID: ownerUserID } = useParams();


  useEffect(() => {
    //get post list of logged in user
    const fetchPost = async () => {
      const result = await dispatch(
        getPostByUserID({ userID: ownerUserID })
      );
 
      setPostList(result.payload.$values);
    };
    //get logged in user infomation
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: infoLogger.userID })
      );
      setInfoLogger(result.payload);
    };

    fetchUser();
    fetchPost();
  }, [dispatch]);

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

  return (
    <>
      <Toast ref={toastRef} />

      {/* body  */}
      <div>

        {/* post  */}
        <div className="h-full overflow-y-auto">
          {!postlist ? (
            <div className="w-full h-full flex justify-center items-center">
              <div>You dont have any post!</div>
            </div>
          ) : (
            [...postlist].reverse().map((post) => (
              <div key={post.postID}>
                <ItemPost
                  post={post}
                  formatDateTime={formatDateTime}
                  infoLogger={infoLogger}
                  toastRef={toastRef}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OtherProfilePost;
