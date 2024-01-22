import { useEffect, useState } from "react";
import Modal from "../misc/Modal";
import { DocumentType, TemplateType } from "../../types/global";
import { addNewDocument, getTemplates } from "../../api";
import logger from "../../logger";
import toast from "react-hot-toast";
import { ERRORS } from "../../errors";
import { TOAST_MESSAGE, TOAST_OPTIONS } from "../../consts";

interface AddDocumentProps {
  project_id: string;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
}

const AddDocument: React.FC<AddDocumentProps> = ({
  project_id,
  setDocuments,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [pickedTemplate, setPickedTemplate] = useState<string>("");

  useEffect(() => {
    getTemplates()
      .then((res) => setTemplates(res.data.items))
      .catch((err) => {
        logger.error(err);
      });
  }, []);

  const addDoc = (pickedTemplate: string) => {
    addNewDocument(project_id, pickedTemplate ? pickedTemplate : null)
      .then((res) => {
        setDocuments((currDocuments) => [
          ...currDocuments,
          { ...res.data, content: JSON.parse(res.data.content).join("\n") },
        ]);
        setShowModal(!showModal);
        toast.success(TOAST_MESSAGE.documentAdded, TOAST_OPTIONS);
      })
      .catch((err) => {
        logger.error(err);
        if (err.response.status === 403)
          toast.error(ERRORS.notAnAuthor, TOAST_OPTIONS);
        else toast.error(ERRORS.somethingWrong, TOAST_OPTIONS);
      });
  };

  return (
    <>
      <button className="mx-2" onClick={() => setShowModal(!showModal)}>
        <img
          src="/addFile.svg"
          alt="add file"
          className="text-white"
          title="Add new document"
        />
      </button>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <div className="flex flex-col justify-center items-center h-full text-white">
            <p>Add new document</p>
            <select
              className="px-2 py-1.5 mx-0 my-2 border-b outline-none bg-transparent text-white"
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
                className="px-4 m-2 py-1 rounded-md bg-project-window-bonus-100 font-bold"
                onClick={() => addDoc(pickedTemplate)}
              >
                Add
              </button>
              <button
                className="px-4 m-2 py-1 rounded-md bg-gray-500 font-bold"
                onClick={() => setShowModal(!showModal)}
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
