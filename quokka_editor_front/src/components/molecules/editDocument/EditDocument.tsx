import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import CRUDButton from "../../atoms/button/Button";
import axios from "axios";

interface EditDocumentProps {
  documentId: string;
  documentTitle: string;
  documentContent: string;
}
const clientId: number = Date.now();

const EditDocument: React.FC<EditDocumentProps> = ({
  documentId,
  documentTitle,
  documentContent,
}) => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:8100/ws/" + clientId,
    {
      onOpen: () =>
        console.log("client opened connection with id: " + clientId),
    }
  );

  useEffect(() => {
    setTextAreaValue(lastMessage?.data);
    console.log(lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    setTextAreaValue(documentContent);
  }, [documentContent]);

  const handleChange = (value: string) => {
    //setTextAreaValue(value);
    sendMessage(value);
  };

  const handleUpdate = () => {
    axios
      .patch("http://localhost:8100/documents/" + documentId, {
        title: documentTitle,
        content: lastMessage?.data,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>{documentTitle}</h1>
      <textarea
        style={{ width: "400px", height: "250px" }}
        name="textarea"
        value={textAreaValue}
        onChange={(event) => handleChange(event.target.value)}
      />
      <CRUDButton
        buttonName="Zapisz dokument"
        buttonType="submit"
        handler={handleUpdate}
      />
    </div>
  );
};

export default EditDocument;
