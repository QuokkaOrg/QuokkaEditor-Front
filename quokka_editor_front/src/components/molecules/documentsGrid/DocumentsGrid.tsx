import { useAppSelector } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";
import PaginatedDocuments from "./PaginatedDocuments";
const DocumentsGrid: React.FC = () => {
  return (
    <div className="flex flex-col mx-24 my-4 w-full">
      <h3 className="font-bold text-lg text-white">Your Projects</h3>
      <PaginatedDocuments />
    </div>
  );
};

export default DocumentsGrid;
