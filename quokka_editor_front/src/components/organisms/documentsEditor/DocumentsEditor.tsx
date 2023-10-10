import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../consts";
import { useLocation } from "react-router-dom";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-palenight.css";

type Operation = {
  type: "INSERT" | "DELETE";
  char?: string;
  pos: number;
  revision: number;
};

type Ack = {
  message: "ACK";
  revision_log: number;
};

type MessageOrAck = Operation & Ack;

type ClientState = {
  lastSyncedRevision: number;
  pendingChanges: Operation[];
  sentChanges: Operation | null;
  documentState: string;
};

type ServerState = {
  pendingChanges: Operation[];
  revisionLog: Operation[];
  documentState: string;
};

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};
const initialServer = {
  pendingChanges: [],
  revisionLog: [],
  documentState: "",
};

const insertAt = (str: string, index: number, insertion: string) => {
  if (index < 0 || index > str.length) {
    return str;
  }
  return str.slice(0, index) + insertion + str.slice(index);
};

const removeAt = (str: string, index: number) => {
  if (index < 0 || index >= str.length) {
    return str;
  }
  return str.slice(0, index) + str.slice(index + 1);
};

const DocumentsEditor = () => {
  const location = useLocation();
  const [document, setDocument] = useState({ id: "", title: "", content: "" });
  const [client, setClient] = useState<ClientState>(initialClient);
  const [socket, setSocket] = useState<WebSocket>();

  const id = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length
  );

  useEffect(() => {
    axios
      .get(API_URL + "documents" + id, {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => {
        console.log(res.data);
        setDocument(res.data);
        setClient({ ...client, documentState: res.data.content });
      });
  }, []);

  useEffect(() => {
    const s = new WebSocket("ws://localhost:8100/ws" + id);
    s.onopen = (e) => console.log("Connected to WebSocket");
    s.onclose = (e) => console.log("Disconnected from WebSocket");
    s.onerror = (err) => console.error("Websocket Error: " + err);
    s.onmessage = (e) => {
      console.log("Message", e.data);
      const message = JSON.parse(e.data);
      if (message.char) {
        setClient((prevClient) => ({
          ...client,
          documentState: insertAt(
            prevClient.documentState,
            message.pos,
            message.char
          ),
        }));
      }
      if (message.type === "DELETE") {
        setClient((prevClient) => ({
          ...client,
          documentState: removeAt(prevClient.documentState, message.pos),
        }));
      }
    };
    setSocket(s);
    return () => s.close();
  }, []);

  const onChangeHandler = (
    editor: CodeMirror.Editor,
    data: CodeMirror.EditorChange,
    value: string
  ) => {
    const pos = data.from.ch;
    if (data.origin === "+input") {
      console.log("textttt", data.text[0]);
      socket?.send(
        JSON.stringify({
          type: "INSERT",
          char: data.text[0],
          pos: pos,
          revision: 0,
        })
      );
      setClient({
        ...client,
        documentState: insertAt(client.documentState, pos, data.text[0]),
      });
    } else if (data.origin === "+delete") {
      socket?.send(
        JSON.stringify({
          type: "DELETE",
          pos: pos,
          revision: 0,
        })
      );
      setClient({
        ...client,
        documentState: removeAt(client.documentState, pos),
      });
    }
  };

  return (
    <CodeMirror
      value={client.documentState}
      options={{
        mode: "LaTeX",
        theme: "material-palenight",
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        console.log("Data:", data);

        onChangeHandler(editor, data, value);
      }}
    />
  );
};
export default DocumentsEditor;
