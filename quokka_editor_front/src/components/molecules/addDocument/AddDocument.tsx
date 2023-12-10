import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import Modal from "../../misc/Modal";
import { TemplateType } from "../../../types/global";
import { useNavigate } from "react-router-dom";
import logger from "../../../logger";
import { addNewDocument, addNewProject, getTemplates } from "../../../api";
import { addProject } from "../../../Redux/documentsSlice";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { TOAST_OPTIONS } from "../../../consts";
import { ERRORS } from "../../../errors";

const AddDocument: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [pickedTemplate, setPickedTemplate] = useState<string | null>(null);
  useEffect(() => {
    getTemplates().then((res) => setTemplates(res.data.items));
  }, []);

  const addDoc = (pickedTemplate: string | null) => {
    addNewProject()
      .then((res) => {
        const projectResponse = res.data;
        addNewDocument(res.data.id, pickedTemplate)
          .then((res) => {
            dispatch(addProject(projectResponse));
            setAddModal(!addModal);
            navigate(res.data.id);
          })
          .catch((err) => {
            logger.error(err);
            setAddModal(!addModal);
            toast.error(ERRORS.somethingWrong, TOAST_OPTIONS);
          });
      })
      .catch((err: AxiosError) => {
        logger.error(err);
        navigate("/");
        toast.error(ERRORS.sessionExpired, TOAST_OPTIONS);
      });
  };

  return (
    <>
      <button
        onClick={() => setAddModal(!addModal)}
        className="rounded-full py-2 px-4 mb-6 m-1 font-semibold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] bg-project-theme-dark-200 text-white"
      >
        + Add new
      </button>
      {addModal && (
        <Modal setShowModal={setAddModal}>
          <div className="flex flex-col justify-center items-center rounded-2xl h-full bg-project-theme-dark-200 text-slate-200">
            <p>Add new document</p>
            <select
              className="px-3 py-2 my-1 border-b outline-none bg-transparent"
              value={pickedTemplate ? pickedTemplate : ""}
              name="templateSelection"
              onChange={(e) => setPickedTemplate(e.target.value)}
            >
              <option
                value=""
                disabled
                className="bg-project-theme-dark-350 text-slate-200"
              >
                Pick a template
              </option>
              {templates?.map((template) => (
                <option
                  key={template.id}
                  value={template.id}
                  className="bg-project-theme-dark-350 text-slate-200"
                >
                  {template.title}
                </option>
              ))}
            </select>
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-project-window-bonus-100 font-bold"
                onClick={() => addDoc(pickedTemplate)}
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
