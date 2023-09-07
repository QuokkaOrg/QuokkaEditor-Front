import DeleteDocument from "../../molecules/deleteDocument/DeleteDocument";

interface DocumentBoxProps {
  title?: string;
  content?: string;
  id?: string;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({ title, content, id }) => {
  return (
    <div className="h-48 w-56 rounded-md bg-[#ffe7c9]">
      {title || ""} <DeleteDocument title={title || ""} id={id || ""} />
    </div>
  );
};

export default DocumentBox;
