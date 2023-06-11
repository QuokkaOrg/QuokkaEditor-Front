import { useState } from "react";
import "./App.css";
import AddDocument from "./components/molecules/addDocument/AddDocument";
import ShowAllDocuments from "./components/organisms/showAllDocuments/ShowAllDocuments";
import EditDocument from "./components/molecules/editDocument/EditDocument";
import { DocumentType } from "./types";

function App() {
  const [currentDocument, setCurrentDocument] = useState<DocumentType>({});

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ShowAllDocuments {...{ setCurrentDocument }} />
      <AddDocument />
      <EditDocument
        documentId={currentDocument.id}
        documentTitle={currentDocument.title}
        documentContent={currentDocument.content}
      />
    </div>
  );
}

export default App;
