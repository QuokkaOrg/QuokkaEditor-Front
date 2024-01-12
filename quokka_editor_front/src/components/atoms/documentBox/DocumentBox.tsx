import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Redux/hooks";
import { setSelectedProject } from "../../../Redux/projectsSlice";

interface DocumentBoxProps {
  title: string;
  id: string;
  selected: boolean;
  even: boolean;
  content?: string;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({
  title,
  id,
  selected,
  even,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onDoubleClickHandler = () => {
    navigate("/projects/" + id);
  };

  const onClickHandler = () => {
    dispatch(setSelectedProject(id));
  };

  return (
    <div
      className={`${
        selected ? "outline outline-2 outline-cyan-600 shadow-md" : null
      } ${
        even
          ? "bg-project-theme-dark-200"
          : "bg-project-theme-dark-300 opacity-90"
      } px-4 py-2 mt-3 w-full rounded-md text-slate-200 font-semibold cursor-pointer`}
      onDoubleClick={onDoubleClickHandler}
      onClick={onClickHandler}
    >
      {title}
    </div>
  );
};

export default DocumentBox;
