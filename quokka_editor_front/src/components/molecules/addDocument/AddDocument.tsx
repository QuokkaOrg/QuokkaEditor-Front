import { useState } from "react";
import CRUDButton from "../../atoms/button/Button";
import axios from "axios";

const AddDocument: React.FC = () => {
  const [documentData, setDocumentData] = useState({
    title: "",
    content: "",
  });

  const handleClick = () => {
    axios.post("http://localhost:8100/documents", { ...documentData });
  };

  return (
    <form action="post">
      <input
        type="text"
        name="docTitle"
        placeholder="Document Title"
        onChange={(event) =>
          setDocumentData({ ...documentData, title: event.target.value })
        }
      />
      <input
        type="text"
        name="docContent"
        placeholder="Document initial content"
        onChange={(event) =>
          setDocumentData({ ...documentData, content: event.target.value })
        }
      />
      <CRUDButton
        buttonName="Add Document"
        buttonType="submit"
        handler={handleClick}
      />
    </form>
  );
};

export default AddDocument;
