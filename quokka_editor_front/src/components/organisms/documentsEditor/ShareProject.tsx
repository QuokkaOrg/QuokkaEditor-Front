import { useState } from "react";
import Modal from "../../misc/Modal";
import { ProjectState } from "../../../Redux/projectsSlice";
import { changeProjectPrivileges, shareProject } from "../../../api";
import toast from "react-hot-toast";
import { TOAST_MESSAGE, TOAST_OPTIONS } from "../../../consts";
import { ERRORS } from "../../../errors";

interface ShareProjectProps {
  projectId: string;
  title: string;
  isShared: boolean;
  sharedPrivileges: string;
  setProjectPrivileges: React.Dispatch<React.SetStateAction<ProjectState>>;
}

const ShareProject: React.FC<ShareProjectProps> = ({
  projectId,
  title,
  isShared,
  sharedPrivileges,
  setProjectPrivileges,
}) => {
  const [shareModal, setShareModal] = useState<boolean>(false);

  const changePrivilegesHandler = (privileges: string) => {
    changeProjectPrivileges(projectId, privileges, isShared)
      .then(() => {
        setProjectPrivileges((currProject) => ({
          ...currProject,
          shared_role: privileges,
        }));
        toast.success(TOAST_MESSAGE.privilegesChanged, TOAST_OPTIONS);
      })
      .catch(() => toast.error(ERRORS.somethingWrong, TOAST_OPTIONS));
  };

  const shareHandler = () => {
    shareProject(projectId, sharedPrivileges, isShared)
      .then(() => {
        setProjectPrivileges((currProject) => ({
          ...currProject,
          shared_by_link: !currProject.shared_by_link,
        }));
        !isShared
          ? toast.success(TOAST_MESSAGE.documentShared, TOAST_OPTIONS)
          : toast.success(TOAST_MESSAGE.documentNotShared, TOAST_OPTIONS);
        setShareModal(!shareModal);
      })
      .catch(() => toast.error(ERRORS.somethingWrong, TOAST_OPTIONS));
  };

  return (
    <>
      <div
        className="flex select-none cursor-pointer font-bold rounded-full pl-4 shadow hover:shadow-[0px_0px_8px_4px_rgba(75,75,75,0.15)] bg-project-theme-dark-350 justify-center items-center"
        onClick={() => setShareModal(!shareModal)}
      >
        <h1>Share</h1>
        <div className="ml-2 p-3 h-full shadow-[-3px_0px_8px_0px_rgba(0,0,0,0.)] rounded-full bg-project-theme-dark-400">
          <img src="/sharesrc.svg"></img>
        </div>
      </div>
      {shareModal && (
        <Modal setShowModal={setShareModal}>
          <div className="p-1 flex flex-col justify-center text-center items-center h-full text-white">
            <p>Do you want to share "{title}"?</p>
            <p
              className="bg-project-theme-dark-400 rounded-full m-2 p-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(TOAST_MESSAGE.urlCopied, TOAST_OPTIONS);
              }}
            >
              {window.location.href}
            </p>
            <div className="flex flex-col m-4">
              <p>Change privileges</p>
              <button
                className={`${
                  sharedPrivileges === "READ"
                    ? "border-2 border-project-window-bonus-100 "
                    : ""
                }bg-project-theme-dark-400 rounded-full m-1 mx-4 p-1`}
                onClick={() => changePrivilegesHandler("READ")}
              >
                Read
              </button>
              <button
                className={`${
                  sharedPrivileges === "EDIT"
                    ? "border-2 border-project-window-bonus-100 "
                    : ""
                }bg-project-theme-dark-400 rounded-full m-1 mx-4 p-1`}
                onClick={() => changePrivilegesHandler("EDIT")}
              >
                Edit
              </button>
            </div>
            <div>
              <button
                className="px-4 m-2 mx-8 py-2 rounded-full bg-project-window-bonus-100 font-bold"
                onClick={shareHandler}
              >
                {isShared ? "Stop Sharing" : "Share"}
              </button>
              <button
                className="px-4 m-2 py-2 mx-8 rounded-full bg-gray-500 font-bold"
                onClick={() => setShareModal(!shareModal)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ShareProject;
