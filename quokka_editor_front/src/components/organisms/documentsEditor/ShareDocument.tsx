import { useState } from "react";
import Modal from "../../misc/Modal";
import { DocumentState } from "../../../Redux/documentsSlice";
import { changeDocumentPrivileges, shareDocument } from "../../../api";

interface ShareDocumentProps {
  docId: string;
  title: string;
  isShared: boolean;
  sharedPrivileges: string;
  setDocumentPrivileges: React.Dispatch<React.SetStateAction<DocumentState>>;
}

const ShareDocument: React.FC<ShareDocumentProps> = ({
  docId,
  title,
  isShared,
  sharedPrivileges,
  setDocumentPrivileges,
}) => {
  const [shareModal, setShareModal] = useState<boolean>(false);

  const changePrivilegesHandler = (privileges: string) => {
    changeDocumentPrivileges(docId, privileges, isShared)
      .then((res) => {
        //TODO change alert to toast
        setDocumentPrivileges((currDocument) => ({
          ...currDocument,
          shared_role: privileges,
        }));
        alert("Privileges changed!");
      })
      .catch((err) =>
        //TODO change alert to toast
        alert("Something went wrong. Please Try Again")
      );
  };

  const shareHandler = () => {
    shareDocument(docId, sharedPrivileges, isShared)
      .then((res) => {
        setDocumentPrivileges((currDocument) => ({
          ...currDocument,
          shared_by_link: !currDocument.shared_by_link,
        }));
        //TODO change alert to toast
        alert(
          "Document " +
            title +
            " sharing options have been updated succesfully!"
        );
        setShareModal(!shareModal);
      })
      .catch((err) =>
        //TODO change alert to toast
        alert("Something went wrong with sharing document. Please Try Again")
      );
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
                //TODO change alert to toast
                alert("URL Copied to clipboard!");
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

export default ShareDocument;
