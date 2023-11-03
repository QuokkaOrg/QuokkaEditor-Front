import { useNavigate } from "react-router-dom";
import DeleteDocument from "../../molecules/deleteDocument/DeleteDocument";

interface DocumentBoxProps {
  title: string;
  content?: string;
  id: string;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({ title, content, id }) => {
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate("/documents/" + id);
  };

  return (
    <div className="h-48 w-56 rounded-md text-white bg-[#20222B]" onClick={onClickHandler}>
      {title} <DeleteDocument title={title} id={id} />
    </div>
  );
};

export default DocumentBox;
