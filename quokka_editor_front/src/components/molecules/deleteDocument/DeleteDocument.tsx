import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { deleteDocument } from "../../../Redux/documentsSlice";
import Modal from "../../misc/Modal";
import { deleteSelectedDocument } from "../../../api";
import logger from "../../../logger";
import toast from "react-hot-toast";
import { TOAST_OPTIONS } from "../../../consts";
import { ERRORS } from "../../../errors";

interface DeleteDocumentType {
  id: string;
  title: string;
}

const DeleteDocument: React.FC = () => {
  const documentsState = useAppSelector((state) => state.documents.items);
  const dispatch = useAppDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<
    DeleteDocumentType | undefined
  >(undefined);

  useEffect(() => {
    setDocumentToDelete(
      documentsState.find((document) => {
        if (document.selected)
          return { id: document.id, title: document.title };
      })
    );
  }, [documentsState]);

  const deleteDoc = (docId: string | undefined) => {
    if (!docId) return;
    deleteSelectedDocument(docId)
      .then((res) => {
        dispatch(deleteDocument(docId));
        alert("Document deleted! Status:" + res.status);
        setDeleteModal((currDeleteModal) => !currDeleteModal);
      })
      .catch((err) => {
        logger.error(err);
        toast.error(ERRORS.somethingWrong, TOAST_OPTIONS);
      });
  };

  return (
    <div>
      <button
        type="button"
        className={` ${
          documentToDelete ? "bg-red-500" : "bg-slate-400"
        } m-1 w-32 h-24 font-semibold text-lg rounded-md  drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]`}
        disabled={documentToDelete ? false : true}
        onClick={() => setDeleteModal((currDeleteModal) => !currDeleteModal)}
      >
        Delete
      </button>
      {deleteModal && (
        <Modal setShowModal={setDeleteModal}>
          <div className="flex flex-col justify-center items-center h-full">
            <p>Do you want to delete document "{documentToDelete?.title}"?</p>
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-red-500 font-bold"
                onClick={() => deleteDoc(documentToDelete?.id)}
              >
                YES
              </button>
              <button
                className="px-4 m-2 py-1 rounded-md bg-gray-500 font-bold"
                onClick={() =>
                  setDeleteModal((currDeleteModal) => !currDeleteModal)
                }
              >
                NO
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeleteDocument;
