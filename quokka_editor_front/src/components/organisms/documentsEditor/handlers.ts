import axios from "axios";
import { API_URL } from "../../../consts";
import { ClientState, OperationType, Pos } from "../../../types/ot";
import { parse } from "latex.js";

export const getPDFHandler = (id: string) => {
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
  setClient: React.Dispatch<React.SetStateAction<ClientState>>
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
export const onChangeHandler = (
  generator: React.MutableRefObject<any>,
  interval: React.MutableRefObject<number | null>,
  setState: React.Dispatch<
    React.SetStateAction<{
      data: string | null;
      error: string | null;
    }>
  >,
  value: string
) => {
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
      if (e instanceof Error) return setState({ data: null, error: e.message });
      return setState({ data: null, error: "Unknown error" });
    }
  }, 1000);
};