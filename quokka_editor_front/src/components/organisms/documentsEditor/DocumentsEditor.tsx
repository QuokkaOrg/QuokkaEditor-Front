import { useEffect, useRef, useState } from "react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/stex/stex";

import { ClientState, CursorType, OperationType, Pos } from "../../../types/ot";
import { createWebSocket } from "./webSocket";

import { HtmlGenerator } from "latex.js";
import RemoteCursor from "../../atoms/RemoteCursor";
import { ScrollInfo } from "codemirror";
import {
  getPDFHandler,
  onBeforeChangeHandler,
  onChangeHandler,
  onCursorHandler,
} from "./handlers";
import { sendChanges } from "./ot";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { DocumentState } from "../../../Redux/projectsSlice";
import { DocumentType } from "../../../types/global";

interface DocumentsEditorProps {
  client: ClientState;
  setClient: React.Dispatch<React.SetStateAction<ClientState>>;
  id: string;
  editingDocument: DocumentType;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
}

const initialScroll = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  clientWidth: 0,
  clientHeight: 0,
};

const DocumentsEditor: React.FC<DocumentsEditorProps> = ({
  client,
  setClient,
  id,
  editingDocument,
  setDocuments,
}) => {
  const [{ data, error }, setState] = useState<{
    data: string;
    error: string | null;
  }>({ data: " ", error: null });
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>(initialScroll);

  const socket = useRef<WebSocket | null>(null);
  const interval = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const editorRef = useRef<CodeMirror.Editor | null>(null);
  const generator = useRef(new HtmlGenerator({ hyphenate: false }));

  const dispatch = useAppDispatch();
  const remoteClients = useAppSelector((state) => state.clients.clients);

  useEffect(() => {
    const docId = "/" + editingDocument.id;
    const s = editingDocument.id
      ? createWebSocket(docId, editorRef.current, setClient, dispatch)
      : null;
    socket.current = s;
    return () => s?.close();
  }, [editingDocument]);

  useEffect(() => {
    const handler = () => {
      const height = window.innerHeight;
      const navbarHeight =
        document.getElementById("EditorNavBar")?.clientHeight || 0;
      const fileBarHeight =
        document.getElementById("FilesBar")?.clientHeight || 0;
      editorRef.current?.setSize(
        "100%",
        height - (navbarHeight + fileBarHeight + 10)
      );
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

  useEffect(() => {
    setDocuments((currDocuments) =>
      currDocuments.map((document) => {
        if (document.id === editingDocument.id)
          return { ...document, content: client.documentState };
        else return document;
      })
    );
  }, [client.documentState]);

  return (
    <div className="grid grid-cols-2">
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
          if (!editorRef.current) return;
          onBeforeChangeHandler(
            data,
            value,
            socket,
            client,
            setClient,
            editingDocument
          );
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
      {remoteClients?.map((cursor) => {
        return (
          <RemoteCursor
            key={cursor.user_token}
            cursorData={cursor}
            editor={editorRef.current}
            scrollInfo={scrollInfo}
          />
        );
      })}

      <div className="bg-project-theme-dark-350 px-8 py-4">
        {error || !data ? (
          <p>{error || "Loading..."}</p>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-slate-50 shadow-lg shadow-slate-600"
            srcDoc={data}
          ></iframe>
        )}
      </div>
    </div>
  );
};
export default DocumentsEditor;
