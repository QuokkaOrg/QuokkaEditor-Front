import DocumentButton from "../../atoms/documentButton/DocumentButton";
import DeleteDocument from "../deleteDocument/DeleteDocument";

const DocumentOptions: React.FC = () => {
  return (
    <div className="h-full mb-8 flex flex-col justify-between">
      <div className="flex flex-col">
        <DocumentButton>Shared</DocumentButton>
        <DocumentButton>Favourite</DocumentButton>
        <DocumentButton>Recent</DocumentButton>
      </div>
      <DeleteDocument />
    </div>
  );
};

export default DocumentOptions;
