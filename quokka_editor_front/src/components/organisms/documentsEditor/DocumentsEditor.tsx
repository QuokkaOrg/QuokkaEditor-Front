import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../../consts";
import { useLocation } from "react-router-dom";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/mode/stex/stex";

import { ClientState, OperationType, Pos } from "../../../types/ot";
import { createWebSocket } from "./webSocket";

import { parse, HtmlGenerator } from "latex.js";

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};

const DocumentsEditor = () => {
  const location = useLocation();
  const [client, setClient] = useState<ClientState>(initialClient);
  const interval = useRef<number | null>(null);
  const [{ data, error }, setState] = useState<{
    data: string | null;
    error: string | null;
  }>({ data: null, error: null });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const editorRef = useRef<CodeMirror.Editor | null>(null);
  const socket = useRef<WebSocket | null>(null);

  const id = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length
  );
  const token = location.search;

  const generator = useRef(new HtmlGenerator({ hyphenate: false }));
  //get document
  useEffect(() => {
    axios
      .get(API_URL + "documents" + id, {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => {
        console.log(res);
        setClient({
          ...client,
          documentState: JSON.parse(res.data.content).join("\n"),
          lastSyncedRevision: JSON.parse(res.data.last_revision),
        });
      });
  }, []);

  //open websocket connection
  useEffect(() => {
    const s = createWebSocket(id, editorRef.current, setClient, token);
    socket.current = s;
    return () => s.close();
  }, []);

  useEffect(() => {
    const handler = () => {
      const height = window.innerHeight;
      editorRef.current?.setSize("100%", height);
      if (!iframeRef.current) return;
      const width = iframeRef.current.getBoundingClientRect().width;
      iframeRef.current.contentWindow?.document.body.setAttribute(
        "style",
        `font-size:${Math.min(Math.max(width / 40, 16), 24)}px !important`
      );
    };
    handler();
    window.addEventListener("resize", handler);
  }, [editorRef.current]);

  //setState when got ACK and we have pending changes
  useEffect(() => {
    //console.log(client);
    if (client.sentChanges === null && client.pendingChanges.length !== 0) {
      const operationToSend: OperationType = {
        ...client.pendingChanges[0],
        revision: client.lastSyncedRevision,
      };
      socket.current?.send(JSON.stringify(operationToSend));
      setClient({
        ...client,
        sentChanges: operationToSend,
        pendingChanges: client.pendingChanges.slice(1),
      });
    }
  }, [client.sentChanges]);

  const onChangeHandler = (data: CodeMirror.EditorChange, value: string) => {
    if (!socket.current) return;
    const operation: OperationType = {
      from_pos: { line: data.from.line, ch: data.from.ch },
      to_pos: { line: data.to.line, ch: data.to.ch },
      text: data.text,
      revision: client.lastSyncedRevision,
      type: data.origin?.toUpperCase(),
    };
    if (data.origin) {
      console.log("SENDING OPERATION: ", operation);
      if (client.sentChanges === null) {
        socket.current.send(JSON.stringify(operation));
        setClient((prevClient) => ({
          ...prevClient,
          sentChanges: operation,
          documentState: value,
        }));
      } else {
        setClient((prevClient) => ({
          ...prevClient,
          pendingChanges: [...prevClient.pendingChanges, operation],
          documentState: value,
        }));
      }
      //setClient({ ...client, documentState: value });
    } else if (data.origin === undefined) {
      setClient({ ...client, documentState: value });
    }
  };

  const onCursorHandler = (editor: CodeMirror.Editor) => {
    if (!socket.current) return;
    const cursor = editor.getCursor();
    const cursorPos: Pos = { ch: cursor.ch, line: cursor.line };
    socket.current.send(JSON.stringify({ type: "cursor", data: cursorPos }));
  };

  const getPDFHandler = () => {
    axios
      .get(API_URL + "documents/get-pdf" + id, {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
          Accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove;
      });
  };

  return (
    <div className="grid grid-cols-2 h-screen">
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
        onBeforeChange={(_editor, data, value) => {
          onChangeHandler(data, value);
        }}
        onChange={(_editor, _data, value) => {
          if (!generator.current)
            return setState({ data: null, error: "Generator is undefined" });
          if (interval.current) clearInterval(interval.current);
          interval.current = setTimeout(() => {
            generator.current.reset();
            try {
              const parsed = parse(value, {
                generator: generator.current,
              }).htmlDocument("https://cdn.jsdelivr.net/npm/latex.js/dist/");
              return setState({
                data: parsed.documentElement.outerHTML,
                error: null,
              });
            } catch (e) {
              console.log(e);
              if (e instanceof Error)
                return setState({ data: null, error: e.message });
              return setState({ data: null, error: "Unknown error" });
            }
          }, 1000);
        }}
        onCursorActivity={(editor) => {
          if (socket.current?.readyState === socket.current?.OPEN)
            onCursorHandler(editor);
        }}
      />
      <div className="bg-orange-200 p-16">
        <button
          className="rounded-full px-6 py-3 flex items-center justify-center bg-purple-500 text-white text-2xl absolute right-8 bottom-8 shadow-xl"
          type="button"
          onClick={() => console.log(client)}
        >
          Download PDF
        </button>
        {error || !data ? (
          <p>{error || "Loading..."}</p>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white shadow-lg p-8"
            srcDoc={data}
          ></iframe>
        )}
      </div>
    </div>
  );
};
export default DocumentsEditor;
