import { useAppSelector } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";

const DocumentsGrid: React.FC = () => {
  const documents = useAppSelector((state) => state.documents.documents);

  return (
    <div className="my-4">
      <h3 className="font-semibold text-white">Your Files</h3>
      <h3 className="font-semibold text-white">Recent</h3>
      <div className="grid grid-cols-6 gap-4">
        {documents.map(({ title, id, selected }) => (
          <DocumentBox key={id} {...{ title, id, selected }} />
        ))}
      </div>
      <h3 className="font-semibold text-white">Projects</h3>
      <h3 className="font-semibold text-white">Files</h3>
      <div className="grid grid-cols-6 gap-4 "></div>
    </div>
  );
};

export default DocumentsGrid;
