import DocumentBox from "../../atoms/documentBox/DocumentBox";

const DocumentsGrid: React.FC = () => {
  return (
    <div className="my-4">
      <h3 className="font-semibold">Your Files</h3>
      <h3 className="font-semibold">Recent</h3>
      <div className="grid grid-cols-6 gap-4">
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
      </div>
      <h3 className="font-semibold">Projects</h3>
      <h3 className="font-semibold">Files</h3>
      <div className="grid grid-cols-6 gap-4 ">
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
        <DocumentBox />
      </div>
    </div>
  );
};

export default DocumentsGrid;
