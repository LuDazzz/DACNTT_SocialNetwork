import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { getUserByUserID, reportUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { countFriendByUserID } from "../../redux/Profile/countFriendSlice";
import { checkIsFriend } from "../../redux/Friend/friendSlice";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { reportSchema } from "../../utils/yupValidation";

const OtherProfile = () => {
  const { username: ownerUsername, userID: ownerUserID } = useParams();
  const dispatch = useDispatch();
  const [infoLogger, setInfoLogger] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [infoUser, setInfoUser] = useState();
  const [friendCount, setFriendCount] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [contentReport, setContentReport] = useState("");
  const toastRef = useRef(null);

  //Check is friend
  const checkIsFriendOrNot = async (ownerUserID, loggerID) => {
    const result = await dispatch(
      checkIsFriend({ userID1: ownerUserID, userID2: loggerID })
    );
    setIsFriend(result.payload.isFriend);
  };
  checkIsFriendOrNot(ownerUserID, infoLogger.userID);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch(
        getUserByUserID({ userID: infoLogger.userID })
      );
      const resultOwner = await dispatch(
        getUserByUserID({ userID: ownerUserID })
      );
      setInfoUser(resultOwner.payload);
      setInfoLogger(result.payload);
    };

    const fetchFriendCount = async () => {
      const result = await dispatch(
        countFriendByUserID({ userID: ownerUserID })
      );
      setFriendCount(result.payload.friendsCount);
    };

    fetchFriendCount();

    fetchUser();
  }, [dispatch]);

  //form report user
  const { register: reqReportUser, handleSubmit: handleSubmitReportUser } =
    useForm({
      defaultValues: { loggerID: infoLogger?.userID, userID: ownerUserID },
      resolver: yupResolver(reportSchema),
    });

  //Handle display date time
  const formatDateTime = (isoString) => {
    const postDate = new Date(isoString);

    return postDate.toLocaleDateString();
  };

  //submit report user
  const onSubmitReport = async (data) => {
    const result = await dispatch(
      reportUser({
        SenderID: data.loggerID,
        UserIsReported: data.userID,
        Reason: data.reportcontent,
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

  //Error submit report
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

  return (
    <>
      <Toast ref={toastRef} />

      {/* report User Dialog  */}
      <Dialog
        visible={showReport}
        modal
        draggable={false}
        className="w-1/3 h-fit rounded-xl"
        content={({ hide }) => (
          <form
            onSubmit={handleSubmitReportUser(onSubmitReport, onError)}
            className="bg-white w-full h-full flex flex-col gap-3 justify-center rounded-xl items-center pb-5"
          >
            <div className="p-5 text-xl font-bold text-cyan-500">
              Report User
            </div>
            <InputTextarea
              {...reqReportUser("reportcontent")}
              id="reportcontent"
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

      <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="w-2/4 h-1/10 min-w-700 font-bold text-white flex items-center justify-center">
          Profile
        </div>
        <div className="w-2/4 min-w-700 h-9/10 border-2 border-gray-300 shadow-2xl bg-white rounded-t-2xl pt-5">
          <div className="w-full relative h-1/3 px-5">
            <div className="absolute right-5">
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${infoUser?.profilePicture}`}
                  className="rounded-56px h-28 w-28 border"
                />
              </div>
            </div>
            <div className="flex flex-col w-3/4 h-3/4 justify-between">
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <div className="text-xl font-bold">
                    {infoUser?.lastName} {infoUser?.firstName}
                  </div>
                </div>
                <div>{infoUser?.username}</div>
              </div>
              <div className="p-1 h-20 border-2 rounded-2xl overflow-auto">
                {infoUser?.bio}
              </div>
              <div className="text-gray-500 text-sm pb-3">
                {friendCount + " friends"}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className=" flex gap-3 w-4/5">
                <Button
                  unstyled
                  label="Add Friend"
                  className="bg-cyan-500 text-white w-fit px-10 py-2 rounded-xl font-medium"
                />
                <Button
                  unstyled
                  label="Show Profile"
                  className="bg-cyan-500 text-white w-2/3 py-2 rounded-xl font-medium"
                />
              </div>
              <div
                onClick={() => setShowReport(true)}
                style={{ fontWeight: "bold" }}
                className="pi pi-flag p-3 rounded-full text-cyan-500 hover:bg-slate-200 hover:text-red-500 hover:cursor-pointer"
              />
            </div>
          </div>
          <div className="h-2/3 w-full ">
            <div className="flex">
              <NavLink
                to={`/otherprofile/${ownerUsername}/${ownerUserID}`}
                end
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/3 py-2 text-center font-semibold text-cyan-300 border-b border-cyan-300 active:text-cyan-200"
              >
                Post
              </NavLink>
              <NavLink
                to={`/otherprofile/${ownerUsername}/${ownerUserID}/shared`}
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/3 py-2 text-center font-semibold text-cyan-300 border-b border-cyan-300 active:text-cyan-200"
              >
                Shared
              </NavLink>
              <NavLink
                to={`/otherprofile/${ownerUsername}/${ownerUserID}/friend`}
                style={({ isActive }) => {
                  return isActive
                    ? {
                        color: "#0097A7",
                        fontWeight: "bold",
                        borderBottom: "solid",
                      }
                    : {};
                }}
                className="w-1/3 py-2 text-center font-semibold text-cyan-300 border-b border-cyan-300 active:text-cyan-200"
              >
                Friend List
              </NavLink>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherProfile;
