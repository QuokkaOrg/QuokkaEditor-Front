import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import Modal from "../../misc/Modal";
import { deleteSelectedProject } from "../../../api";
import logger from "../../../logger";
import toast from "react-hot-toast";
import { TOAST_MESSAGE, TOAST_OPTIONS } from "../../../consts";
import { ERRORS } from "../../../errors";
import { deleteProject } from "../../../Redux/documentsSlice";

interface DeleteProjectType {
  id: string;
  title: string;
}

const DeleteDocument: React.FC = () => {
  const projectsState = useAppSelector((state) => state.projects.items);
  const dispatch = useAppDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<
    DeleteProjectType | undefined
  >(undefined);

  useEffect(() => {
    setProjectToDelete(
      projectsState.find((project) => {
        if (project.selected) return { id: project.id, title: project.title };
      })
    );
  }, [projectsState]);

  const deleteProj = (projectId: string | undefined) => {
    if (!projectId) return;
    deleteSelectedProject(projectId)
      .then((res) => {
        dispatch(deleteProject(projectId));
        toast.success(TOAST_MESSAGE.deleted, TOAST_OPTIONS);
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
          projectToDelete ? "bg-red-500" : "bg-slate-400"
        } m-1 w-32 h-24 font-semibold text-lg rounded-md  drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]`}
        disabled={projectToDelete ? false : true}
        onClick={() => setDeleteModal((currDeleteModal) => !currDeleteModal)}
      >
        Delete
      </button>
      {deleteModal && (
        <Modal setShowModal={setDeleteModal}>
          <div className="flex flex-col justify-center items-center h-full text-slate-200">
            <h3 className="font-semibold text-lg m-2">
              Do you want to delete project "{projectToDelete?.title}"?
            </h3>
            <div>
              <button
                className="px-4 m-2 py-1 rounded-md bg-red-500 font-bold"
                onClick={() => deleteProj(projectToDelete?.id)}
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
