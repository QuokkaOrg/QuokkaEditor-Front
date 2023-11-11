import { useAppSelector } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";
import PaginatedDocuments from "./PaginatedDocuments";
const DocumentsGrid: React.FC = () => {
  return (
    <div className="my-4">
      <h3 className="font-semibold text-white">Your Files</h3>
      <h3 className="font-semibold text-white">Recent</h3>
      <PaginatedDocuments />
      <h3 className="font-semibold text-white">Projects</h3>
      <h3 className="font-semibold text-white">Files</h3>
      <div className="grid grid-cols-6 gap-4 "></div>
    </div>
  );
};

export default DocumentsGrid;
