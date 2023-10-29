import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../../consts";
import { useLocation } from "react-router-dom";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/stex/stex";

import { ClientState, CursorType, OperationType, Pos } from "../../../types/ot";
import { createWebSocket } from "./webSocket";

import { HtmlGenerator } from "latex.js";
import RemoteCursor from "../../atoms/remoteCursor/RemoteCursor";
import { ScrollInfo } from "codemirror";
import {
  getPDFHandler,
  onBeforeChangeHandler,
  onChangeHandler,
  onCursorHandler,
} from "./handlers";
import { sendChanges } from "./ot";

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};
const initialScroll = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  clientWidth: 0,
  clientHeight: 0,
};

const DocumentsEditor = () => {
  const [client, setClient] = useState<ClientState>(initialClient);
  const [{ data, error }, setState] = useState<{
    data: string | null;
    error: string | null;
  }>({ data: null, error: null });
  const [remoteCursors, setRemoteCursors] = useState<CursorType[] | null>([]);
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>(initialScroll);

  const socket = useRef<WebSocket | null>(null);
  const interval = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const editorRef = useRef<CodeMirror.Editor | null>(null);
  const generator = useRef(new HtmlGenerator({ hyphenate: false }));

  const location = useLocation();
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
        setClient({
          ...client,
          documentState: JSON.parse(res.data.content).join("\n"),
          lastSyncedRevision: JSON.parse(res.data.last_revision),
        });
      });
  }, []);

  useEffect(() => {
    const s = createWebSocket(
      id,
      editorRef.current,
      setClient,
      setRemoteCursors
    );
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

  useEffect(() => {
    sendChanges(socket, client, setClient);
  }, [client.sentChanges]);

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
          theme: "dracula",
          lineNumbers: true,
          lineWrapping: true,
        }}
        onBeforeChange={(_editor, data, value) => {
          onBeforeChangeHandler(data, value, socket, client, setClient);
        }}
        onChange={(_editor, _data, value) => {
          onChangeHandler(generator, interval, setState, value);
        }}
        onCursorActivity={(editor) => {
          if (socket.current?.readyState === socket.current?.OPEN)
            onCursorHandler(editor, socket);
        }}
        onScroll={() => {
          if (!editorRef.current) return;
          setScrollInfo(editorRef.current.getScrollInfo());
        }}
      />
      {remoteCursors?.map((cursor) => (
        <RemoteCursor
          key={cursor.token}
          cursorData={cursor}
          editor={editorRef.current}
          scrollInfo={scrollInfo}
        />
      ))}

      <div className="bg-orange-200 p-16">
        <button
          className="rounded-full px-6 py-3 flex items-center justify-center bg-purple-500 text-white text-2xl absolute right-8 bottom-8 shadow-xl"
          type="button"
          onClick={() => getPDFHandler(id)}
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
