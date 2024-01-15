import { clearRemoteClients } from "../../../Redux/clientsSlice";
import { useAppDispatch } from "../../../Redux/hooks";
import { DocumentType } from "../../../types/global";

interface DocumentsListProps {
  documents: DocumentType[];
  setActiveDocument: React.Dispatch<React.SetStateAction<DocumentType>>;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  setActiveDocument,
}) => {
  const dispatch = useAppDispatch();

  const changeDocument = (document: DocumentType) => {
    dispatch(clearRemoteClients());
    setActiveDocument(document);
  };

  return (
    <>
      {documents.map((document) => (
        <button
          key={document.id}
          onClick={() => changeDocument(document)}
          className="mx-1 my-0.5 px-2 rounded-md bg-project-theme-dark-300 text-slate-200 hover:outline hover:outline-slate-200 hover:outline-1 "
        >
          {document.title}
        </button>
      ))}
    </>
  );
};

export default DocumentsList;
