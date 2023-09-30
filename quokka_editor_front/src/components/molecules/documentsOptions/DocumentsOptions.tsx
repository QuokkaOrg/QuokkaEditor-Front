import DocumentButton from "../../atoms/documentButton/DocumentButton";

const DocumentOptions: React.FC = () => {
  return (
    <>
      <DocumentButton>Shared</DocumentButton>
      <DocumentButton>Favourite</DocumentButton>
      <DocumentButton>Recent</DocumentButton>
      <DocumentButton>Trash</DocumentButton>
    </>
  );
};

export default DocumentOptions;
