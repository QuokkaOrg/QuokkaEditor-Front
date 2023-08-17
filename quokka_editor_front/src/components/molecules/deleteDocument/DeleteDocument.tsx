import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../../consts";
import { useAppDispatch } from "../../../Redux/hooks";
import { deleteDocument } from "../../../Redux/documentsSlice";

interface DeleteDocumentProps {
  id: string;
  title: string;
}

const DeleteDocument: React.FC<DeleteDocumentProps> = ({ id, title }) => {
  const dispatch = useAppDispatch();

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

  const [deleteModal, setdeleteModal] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="text-red-600 font-bold"
        onClick={() => setdeleteModal(!deleteModal)}
      >
        DELETE
      </button>
      <dialog
        className=" absolute z-50 w-1/3 h-1/3 border-2 border-blue-700"
        open={deleteModal}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <p>Do you want to delete document "{title}"?</p>
          <div>
            <button
              className="px-4 m-2 py-1 rounded-md bg-blue-500 font-bold"
              onClick={() => deleteDoc(id)}
            >
              YES
            </button>
            <button
              className="px-4 m-2 py-1 rounded-md bg-gray-500 font-bold"
              onClick={() => setdeleteModal(!deleteModal)}
            >
              NO
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DeleteDocument;
