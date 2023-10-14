import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../../consts";
import { useLocation } from "react-router-dom";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/mode/stex/stex";

import { Operation } from "../../../types/ot";

type ClientState = {
  lastSyncedRevision: number;
  pendingChanges: Operation[];
  sentChanges: Operation | null;
  documentState: string;
};

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};

const DocumentsEditor = () => {
  const location = useLocation();
  const [client, setClient] = useState<ClientState>(initialClient);
  const [socket, setSocket] = useState<WebSocket>();

  const editorRef = useRef<CodeMirror.Editor | null>(null);

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
        console.log(JSON.parse(res.data.content).join("\n"));
        setClient({
          ...client,
          documentState: JSON.parse(res.data.content).join("\n"),
        });
      });
  }, []);

  useEffect(() => {
    const s = new WebSocket("ws://192.168.1.8:8100/ws" + id);
    s.onopen = (e) => console.log("Connected to WebSocket");
    s.onclose = (e) => console.log("Disconnected from WebSocket");
    s.onerror = (err) => console.error("Websocket Error: " + err);
    s.onmessage = (e) => {
      console.log("Ref: ", editorRef.current);
      const message: Operation = JSON.parse(e.data);
      if (message.text) {
        editorRef.current?.replaceRange(
          message.text,
          message.from_pos,
          message.to_pos
        );
      }
      if (message.type === "DELETE") {
        setClient((prevClient) => ({
          ...client,
          documentState: prevClient.documentState,
        }));
      }
    };
    setSocket(s);
    return () => s.close();
  }, []);

  const onChangeHandler = (data: CodeMirror.EditorChange, value: string) => {
    const operation: Operation = {
      from_pos: { line: data.from.line, ch: data.from.ch },
      to_pos: { line: data.to.line, ch: data.to.ch },
      text: data.text,
      revision: 0,
      type: data.origin?.toUpperCase(),
    };
    if (data.origin) {
      console.log("Operation to send:", operation);
      socket?.send(JSON.stringify(operation));
      setClient({ ...client, documentState: value });
    } else if (data.origin === undefined) {
      setClient({ ...client, documentState: value });
    }
  };

  return (
    <CodeMirror
      editorDidMount={(editor) => {
        editorRef.current = editor;
      }}
      editorWillUnmount={() => (editorRef.current = null)}
      value={client.documentState}
      options={{
        mode: "stex",
        theme: "ayu-mirage",
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        console.log("Data:", data);
        onChangeHandler(data, value);
      }}
    />
  );
};
export default DocumentsEditor;
