import { PARSER_STYLES_URL, TOAST_OPTIONS } from "../../../consts";
import { ClientState, OperationType, Pos } from "../../../types/ot";
import { parse } from "latex.js";
import { getPDF } from "../../../api";
import { DocumentState } from "../../../Redux/projectsSlice";
import toast from "react-hot-toast";
import { DocumentType } from "../../../types/global";

export const getPDFHandler = (id: string) => {
  getPDF(id).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove;
  });
};

export const onCursorHandler = (
  editor: CodeMirror.Editor,
  socket: React.MutableRefObject<WebSocket | null>
) => {
  if (!socket.current) return;
  const cursor = editor.getCursor();
  const cursorPos: Pos = { ch: cursor.ch, line: cursor.line };
  socket.current.send(JSON.stringify({ type: "cursor", data: cursorPos }));
};

export const onBeforeChangeHandler = (
  data: CodeMirror.EditorChange,
  value: string,
  socket: React.MutableRefObject<WebSocket | null>,
  client: ClientState,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>,
  document: DocumentType
) => {
  if (!socket.current) return;

  const operation: OperationType = {
    from_pos: { line: data.from.line, ch: data.from.ch },
    to_pos: { line: data.to.line, ch: data.to.ch },
    text: data.text,
    revision: client.lastSyncedRevision,
    type: data.origin?.toUpperCase(),
  };

  if (data.origin) {
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
  } else if (data.origin === undefined) {
    setClient({ ...client, documentState: value });
  }
};
export const onChangeHandler = (
  generator: React.MutableRefObject<any>,
  interval: React.MutableRefObject<number | null>,
  setState: React.Dispatch<
    React.SetStateAction<{
      data: string;
      error: string | null;
    }>
  >,
  value: string
) => {
  if (!generator.current)
    return setState({ data: " ", error: "Generator is undefined" });
  if (interval.current) clearInterval(interval.current);
  interval.current = setTimeout(() => {
    generator.current.reset();
    try {
      const parsed = parse(value, {
        generator: generator.current,
      }).htmlDocument(PARSER_STYLES_URL);
      return setState({
        data: parsed.documentElement.outerHTML,
        error: null,
      });
    } catch (e) {
      if (e instanceof Error) return setState({ data: " ", error: e.message });
      return setState({ data: " ", error: "Unknown error" });
    }
  }, 1000);
};

export const canEdit = (document: DocumentState) => {
  if (document.shared_role === "EDIT") return true;
  return false;
};
