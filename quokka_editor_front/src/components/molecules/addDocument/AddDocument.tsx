import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import { API_URL } from "../../../consts";
import axios from "axios";
import { addDocument } from "../../../Redux/documentsSlice";
import Modal from "../../misc/Modal";
import { TemplateType } from "../../../types/global";
import { useNavigate } from "react-router-dom";
import logger from "../../../logger";

const AddDocument: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [pickedTemplate, setPickedTemplate] = useState<string>("");
  useEffect(() => {
    axios
      .get(API_URL + "templates/", {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => setTemplates(res.data.items))
      .catch((err) => {
        logger.log({
          level: "error",
          message: err,
        });
        //TODO add error toast
      });
  }, []);

  const addDoc = () => {
    axios
      .post(API_URL + "documents/", null, {
        params: pickedTemplate && { template_id: pickedTemplate },
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => {
        dispatch(addDocument(res.data.items));
        setAddModal(!addModal);
        navigate(res.data.id);
      })
      .catch((err) => {
        logger.log({
          level: "error",
          message: err,
        });
        //TODO add error toast or navigate to error page
      });
  };

  return (
    <>
      <button
        onClick={() => setAddModal(!addModal)}
        className="rounded-full py-2 px-4 mb-6 m-1 font-semibold text-lg bg-project-beige-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
      >
        + Add new
      </button>
      {addModal && (
        <Modal setShowModal={setAddModal}>
          <div className="flex flex-col justify-center items-center h-full">
            <p>Add new document</p>
            <select
              className="m-1 border-2 border-cyan-200 rounded-md p-1"
              value={pickedTemplate}
              name="templateSelection"
              onChange={(e) => setPickedTemplate(e.target.value)}
            >
              <option value="" disabled>
                Pick a template
              </option>
              {templates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-blue-500 font-bold"
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
