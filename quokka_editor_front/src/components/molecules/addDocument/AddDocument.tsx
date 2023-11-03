import { useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import { API_URL } from "../../../consts";
import axios from "axios";
import { addDocument } from "../../../Redux/documentsSlice";
import Modal from "../../misc/Modal";

const AddDocument: React.FC = () => {
  const dispatch = useAppDispatch();
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState("");

  const addDoc = () => {
    axios
      .post(
        API_URL + "documents/",
        { title: title, content: "" },
        { headers: { Authorization: sessionStorage.getItem("userToken") } }
      )
      .then((res) => {
        dispatch(addDocument(res.data));
        setAddModal(!addModal);
        setTitle("");
        alert("Document added!");
      });
  };

  return (
    <>
      <button
        onClick={() => setAddModal(!addModal)}
        className="rounded-full py-2 px-4 mb-6 m-1 font-semibold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] bg-[#20222B] text-white"
      >
        + Add new
      </button>
      {addModal && (
        <Modal setShowModal={setAddModal}>
          <div className="flex flex-col justify-center items-center h-full bg-[#20222B] text-white">
            <p>Add new document</p>
            <input
              type="text"
              name="title"
              value={title}
              placeholder="Document Title"
              className="m-1 border-2 border-cyan-200 rounded-md p-1"
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-[#295E6E] font-bold"
                onClick={addDoc}
              >
                Add
              </button>
              <button
                className="px-4 m-2 py-1 rounded-md bg-gray-500 font-bold"
                onClick={() => setAddModal(!addModal)}
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

export default AddDocument;
