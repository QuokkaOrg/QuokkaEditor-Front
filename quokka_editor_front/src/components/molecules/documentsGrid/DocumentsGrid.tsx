import { useAppSelector } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";

const DocumentsGrid: React.FC = () => {
  const documents = useAppSelector((state) => state.documents.documents);

  return (
    <div className="my-4">
      <h3 className="font-semibold">Your Files</h3>
      <h3 className="font-semibold">Recent</h3>
      <div className="grid grid-cols-6 gap-4">
        {documents.map(({ title, content, id }) => (
          <DocumentBox key={id} {...{ title, content, id }} />
        ))}
      </div>
      <h3 className="font-semibold">Projects</h3>
      <h3 className="font-semibold">Files</h3>
      <div className="grid grid-cols-6 gap-4 "></div>
    </div>
  );
};

export default DocumentsGrid;
