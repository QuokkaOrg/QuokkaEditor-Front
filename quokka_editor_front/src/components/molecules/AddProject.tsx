import { useEffect, useState } from "react";
import { useAppDispatch } from "../../Redux/hooks";
import Modal from "../misc/Modal";
import { TemplateType } from "../../types/global";
import { useNavigate } from "react-router-dom";
import logger from "../../logger";
import { addNewDocument, addNewProject, getTemplates } from "../../api";
import { addProject } from "../../Redux/projectsSlice";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { TOAST_OPTIONS } from "../../consts";
import { ERRORS } from "../../errors";

const AddProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>("");
  useEffect(() => {
    getTemplates().then((res) => setTemplates(res.data.items));
  }, []);

  const addDoc = (title: string) => {
    addNewProject(title)
      .then((res) => {
        dispatch(addProject(res.data));
        setAddModal(!addModal);
        navigate(res.data.id);
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
            <h3 className="font-bold text-lg m-2">Add new project</h3>
            <input
              type="text"
              className="px-0 py-1 mx-0 my-2 border-b outline-none bg-transparent text-white"
              value={projectTitle}
              placeholder="Project Title"
              onChange={(e) => setProjectTitle(e.target.value)}
            />
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-project-window-bonus-100 font-bold"
                onClick={() => addDoc(projectTitle)}
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

export default AddProject;
