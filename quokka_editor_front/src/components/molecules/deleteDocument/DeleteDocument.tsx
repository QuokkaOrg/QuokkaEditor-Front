import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../../consts";
import { useAppDispatch } from "../../../Redux/hooks";
import { deleteDocument } from "../../../Redux/documentsSlice";
import Modal from "../../misc/Modal";

interface DeleteDocumentProps {
  id: string;
  title: string;
}

const DeleteDocument: React.FC<DeleteDocumentProps> = ({ id, title }) => {
  const dispatch = useAppDispatch();
  const [deleteModal, setDeleteModal] = useState(false);

  const deleteDoc = (docId: string) => {
    axios
      .delete(API_URL + "documents/" + docId, {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        dispatch(deleteDocument(docId));
        alert("Document deleted! Status:" + res.status);
      });
  };

  return (
    <div>
      <button
        type="button"
        className="text-red-600 font-bold"
        onClick={() => setDeleteModal(!deleteModal)}
      >
        DELETE
      </button>
      {deleteModal && (
        <Modal setShowModal={setDeleteModal}>
          <div className="flex flex-col justify-center items-center h-full">
            <p>Do you want to delete document "{title}"?</p>
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-red-500 font-bold"
                onClick={() => deleteDoc(id)}
              >
                YES
              </button>
              <button
                className="px-4 m-2 py-1 rounded-md bg-gray-500 font-bold"
                onClick={() => setDeleteModal(!deleteModal)}
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
