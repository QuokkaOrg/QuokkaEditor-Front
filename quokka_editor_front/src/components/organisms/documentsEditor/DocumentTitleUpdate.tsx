import { useState } from "react";
import { ProjectState } from "../../../Redux/documentsSlice";
import { updateTitle } from "../../../api";
import toast from "react-hot-toast";
import { TOAST_OPTIONS } from "../../../consts";
import { ERRORS } from "../../../errors";

interface ProjectTitleUpdateProps {
  id: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<ProjectState>>;
}

const ProjectTitleUpdate: React.FC<ProjectTitleUpdateProps> = ({
  id,
  title,
  setTitle,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const titleSubmitHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    updateTitle(id, newTitle)
      .then(() => {
        toast.success("Title Changed", TOAST_OPTIONS);
        setIsEditable((currEditable) => !currEditable);
        setTitle((currProject) => ({ ...currProject, title: newTitle }));
      })
      .catch(() => {
        toast.error(ERRORS.somethingWrong, TOAST_OPTIONS);
      });
  };

  return (
    <>
      <div
        className={`${
          isEditable ? "visible" : "hidden"
        } h-full w-full absolute top-0 left-0 opacity-0 z-10`}
        onClick={() => setIsEditable((currEditable) => !currEditable)}
      ></div>
      {isEditable ? (
        <input
          className="w-36 px-2 py-0.5 bg-project-theme-dark-400 focus:outline-none focus:border-project-window-bonus-100 focus:ring-1 rounded-md text-white z-20"
          type="text"
          name="titleInput"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => titleSubmitHandler(e)}
        />
      ) : (
        <span
          className="w-36 px-1 py-0.5"
          onClick={() => {
            setNewTitle(title);
            setIsEditable((currEditable) => !currEditable);
          }}
        >
          {title}
        </span>
      )}
    </>
  );
};

export default ProjectTitleUpdate;
