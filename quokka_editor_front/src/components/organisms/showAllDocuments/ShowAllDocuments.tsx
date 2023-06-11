import axios from "axios";
import { useEffect, useState } from "react";
import CRUDButton from "../../atoms/button/Button";
import { DocumentType } from "../../../types";

interface ShowAllDocumentsProps {
  setCurrentDocument: React.Dispatch<React.SetStateAction<DocumentType>>;
}

const ShowAllDocuments: React.FC<ShowAllDocumentsProps> = ({
  setCurrentDocument,
}) => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8100/documents")
      .then((response) => setDocuments(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id: string) => {
    axios
      .delete("http://localhost:8100/documents/" + id)
      .then((response) => window.location.reload());
  };

  return (
    <div style={{ display: "flex", placeContent: "center" }}>
      {documents.map((document) => (
        <div
          key={document.id}
          style={{ border: "1px solid black", margin: "1em" }}
          onClick={() => setCurrentDocument(document)}
        >
          <p>{document.title}</p>
          <p>{document.content}</p>
          <CRUDButton
            buttonName="Delete Document"
            buttonType="button"
            handler={() => handleDelete(document.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ShowAllDocuments;
