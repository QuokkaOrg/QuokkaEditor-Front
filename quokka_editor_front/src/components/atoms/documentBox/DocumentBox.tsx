import { useNavigate } from "react-router-dom";
import DeleteDocument from "../../molecules/deleteDocument/DeleteDocument";
import { useAppDispatch } from "../../../Redux/hooks";
import { setSelectedDocument } from "../../../Redux/documentsSlice";

interface DocumentBoxProps {
  title: string;
  id: string;
  selected: boolean;
  content?: string;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({ title, id, selected }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onDoubleClickHandler = () => {
    navigate("/documents/" + id);
  };

  const onClickHandler = () => {
    dispatch(setSelectedDocument(id));
  };

  return (
    <div
      className={`${
        selected ? "border-2 border-cyan-500 shadow-md" : null
      } h-48 w-56 rounded-md bg-[#ffe7c9]`}
      onDoubleClick={onDoubleClickHandler}
      onClick={onClickHandler}
    >
      {title}
    </div>
  );
};

export default DocumentBox;
