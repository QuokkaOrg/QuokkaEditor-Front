import { useState } from "react";
import Modal from "../misc/Modal";
import { DocumentType } from "../../types/global";
import { deleteSelectedDocument } from "../../api";
import toast from "react-hot-toast";
import { TOAST_MESSAGE, TOAST_OPTIONS } from "../../consts";
import { ERRORS } from "../../errors";
import logger from "../../logger";
import { AxiosError } from "axios";

interface DeleteDocumentProps {
  activeDocTitle: string;
  activeDocId: string;
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  setActiveDocument: React.Dispatch<React.SetStateAction<DocumentType>>;
}

const DeleteDocument: React.FC<DeleteDocumentProps> = ({
  activeDocId,
  activeDocTitle,
  documents,
  setDocuments,
  setActiveDocument,
}) => {
  const [showModal, setShowModal] = useState(false);

  const deleteDoc = (docId: string | undefined) => {
    if (!docId) return;
    deleteSelectedDocument(docId)
      .then((res) => {
        setDocuments((currDocuments) =>
          currDocuments.filter((document) => document.id !== docId)
        );
        setActiveDocument(documents[0]);
        setShowModal(!showModal);
        toast.success(TOAST_MESSAGE.documentDeleted, TOAST_OPTIONS);
      })
      .catch((err: AxiosError) => {
        logger.error(err);
        setShowModal(!showModal);
        if (err.response?.status === 403)
          toast.error(ERRORS.notAnAuthor, TOAST_OPTIONS);
        else toast.error(ERRORS.lastDocument, TOAST_OPTIONS);
      });
  };

  return (
    <>
      <button className="mx-2" onClick={() => setShowModal(!showModal)}>
        <img
          src="/deleteFile.svg"
          alt="add file"
          className="text-white"
          title="Delete current document"
        />
      </button>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-slate-200">
              Do you want to delete document "{activeDocTitle}"?
            </p>
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-red-500 font-bold"
                onClick={() => deleteDoc(activeDocId)}
              >
                YES
              </button>
              <button
                className="px-4 m-2 py-1 rounded-md bg-gray-500 font-bold"
                onClick={() => setShowModal(!showModal)}
              >
                NO
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default DeleteDocument;
