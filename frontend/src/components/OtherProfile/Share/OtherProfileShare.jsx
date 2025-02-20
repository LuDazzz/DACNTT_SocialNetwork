import { Divider } from "primereact/divider";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Link } from "react-router";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";

const OtherProfileShare = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [contentReport, setContentReport] = useState();
  const [deletePostId, setDeletePostID] = useState();
  const [reportPostId, setReportPostId] = useState();

  //form report post
  const { register: reportRegister, handleSubmit: handleSubmitReport } =
    useForm();
  return (
    <>
      {/* Delete dialog  */}
      <Dialog
        visible={showDelete}
        style={{ width: "450px" }}
        modal
        draggable={false}
        className="w-fit h-fit bg-white"
        content={({ hide }) => (
          <div className="flex flex-col">
            <div className="flex flex-col items-center p-5">
              <div className="text-center text-xl text-red-500 font-bold">
                Are you sure you want to delete this post from shared list?
              </div>
            </div>
            <div className="gap-5 flex justify-center pb-5">
              <div
                // icon="pi pi-times"
                onClick={() => setShowDelete(false)}
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
                  // onDeletePost(deletePostID);
                  setShowDelete(false);
                }}
                className="bg-red-500 text-white border-none hover:opacity-80"
              />
            </div>
          </div>
        )}
      ></Dialog>

      {/* Report dialog  */}
      <Dialog
        visible={showReport}
        modal
        draggable={false}
        className="w-3/5 h-fit rounded-xl"
        content={({ hide }) => (
          <form
            // onSubmit={handleSubmitEditPost(onUpdatePost, onError)}
            className="bg-white w-full h-full flex flex-col gap-3 justify-center rounded-xl items-center pb-5"
          >
            <div className="p-5 text-xl font-bold text-cyan-500">Edit post</div>
            <InputTextarea
              {...reportRegister("editcontent")}
              id="editcontent"
              value={contentReport}
              onChange={(e) => setContentReport(e.target.value)}
              unstyled
              className="w-4/5 pl-2 border-2 resize-none border-cyan-200 rounded-xl focus:outline-none break-words"
            />
            <div className="w-4/5 gap-5 flex justify-end">
              <div
                // icon="pi pi-times"
                onClick={() => setShowReport(false)}
                className="bg-cyan-500 font-bold text-white border-none hover:opacity-80 pt-3 hover:cursor-pointer px-5 rounded-lg"
              >
                <div className="pi pi-times pr-2" />
                Cancel
              </div>
              <Button
                label="Update"
                type="submit"
                icon="pi pi-check"
                onClick={() => setShowReport(false)}
                className="bg-green-500 text-white border-none hover:opacity-80"
              />
            </div>
          </form>
        )}
      ></Dialog>

      <div className="flex flex-col mt-5 gap-5 w-full h-5/6 overflow-y-auto">
        {[1, 2, 3, 4].map((val) => (
          // <div key={val} className="flex w-full">
          //   <div className="w-1/6 flex justify-center">
          //     <div className="w-fit h-fit ">
          //       <img
          //         src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
          //         className="w-9 h-9 rounded-18px"
          //       />
          //     </div>
          //   </div>
          //   {/* user post */}
          //   <div className="w-3/5">
          //     {/* info */}
          //     <div className="flex gap-10 items-center">
          //       <div className="font-bold h-full text- hover:underline">
          //         username
          //       </div>
          //       <div className="text-gray-500 h-full text-sm">4h</div>
          //     </div>
          //     {/* content */}
          //     <div className="w-full">
          //       <div className="text-sm">
          //         this is content this is content this is contentthis is content
          //         this is content this is content this is content
          //       </div>
          //     </div>
          //     {/* like, cmt, share */}
          //     <div className="flex gap-10 text-gray-500 text-sm">
          //       <div
          //         // onClick={() => onToggleLike(post.id)}
          //         onClick={() => setIsLiked(!isLiked)}
          //         className={`flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95 ${
          //           isLiked ? "text-blue-600 font-bold" : ""
          //         }`}
          //       >
          //         <div className="pi pi-thumbs-up" />
          //         <div>1</div>
          //       </div>
          //       <Link
          //         // to={`/comment?postId=${post.id}`}
          //         // query={{postid: post.id}}
          //         className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
          //       >
          //         <div className="pi pi-comments" />
          //         <div>1</div>
          //       </Link>
          //       <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
          //         <div className="pi pi-share-alt" />
          //         <div>1</div>
          //       </div>
          //     </div>
          //   </div>
          //   {/* more info  */}
          //   <div className="w-1/5 flex justify-end relative">
          //     <div
          //       className="pi pi-ellipsis-h h-fit  rounded-xl p-1  hover:bg-gray-200"
          //     />
          //   </div>
          // </div>
          <div key={val}>
            <div className="flex mt-3">
              {/* user card */}
              <div className="w-1/6 flex justify-center">
                <div className="w-fit h-fit ">
                  <img
                    // src={`data:image/jpeg;base64,${infoLogger?.profilePicture}`}
                    className="w-9 h-9 rounded-18px"
                  />
                </div>
              </div>
              {/* user post */}
              <div className="w-3/5">
                {/* info */}
                <div className="flex gap-10 items-center">
                  <div className="font-bold h-full hover:underline hover:cursor-pointer">
                    username
                    {/* {post.username} */}
                  </div>
                  <div className="text-gray-500 h-full text-sm">
                    {/* {formatDateTime(post.dateTime)} */}
                    date
                  </div>
                </div>
                {/* content */}
                <div className="w-full">
                  <div className="text-sm">
                    {/* {post.content} */}
                    content
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
                    <div>0</div>
                  </div>
                  <Link
                    // to={`/comment?postId=${post.id}`}
                    // query={{postid: post.id}}
                    className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95"
                  >
                    <div className="pi pi-comments" />
                    <div>
                      {/* {post.CommentCounter ? post.CommentCounter : "0"} */}0
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-200 active:scale-95">
                    <div className="pi pi-share-alt" />
                    <div>
                      {/* {post.ShareCounter ? post.ShareCounter : "0"} */}0
                    </div>
                  </div>
                </div>
              </div>
              {/* Edit and Delete  */}
              <div className="w-1/5 flex justify-end">
                <div
                  onClick={() => {
                    // setReportPostId(post.postID)
                    setShowReport(true);
                  }}
                  className="pi pi-flag h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-95"
                />
                <div
                  onClick={() => {
                    // setDeletePostID(post.postID);
                    setShowDelete(true);
                  }}
                  className="pi pi-trash h-fit rounded-full p-2 text-cyan-500 hover:bg-gray-200 hover:text-red-500 hover:cursor-pointer active:scale-95"
                />
              </div>
            </div>
            <Divider />
          </div>
        ))}
      </div>
    </>
  );
};

export default OtherProfileShare;
