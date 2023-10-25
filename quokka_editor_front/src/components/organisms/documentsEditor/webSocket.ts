import { OperationInputs, WEBSOCKET_URL } from "../../../consts";
import { ClientState, OperationType } from "../../../types/ot";
import transform from "./ot";

export const createWebSocket = (
  id: string,
  editor: CodeMirror.Editor | null,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>,
  token: string
) => {
  const s = new WebSocket(WEBSOCKET_URL + id + token);
  s.onopen = (e) => {
    console.log("Connected to WebSocket");
  };
  s.onclose = (e) => console.log("Disconnected from WebSocket");
  s.onerror = (err) => console.error("Websocket Error: " + err);
  s.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(e.data);
    if (data.message) {
      setClient((prevClient) => ({
        ...prevClient,
        lastSyncedRevision: data.revision_log,
        sentChanges: null,
      }));
    }
    if (data.type !== "cursor") {
      const message: OperationType = JSON.parse(e.data);
      if (message.text) {
        console.log("REVISION :: ", data.revision);
        setClient((prevClient) => ({
          ...prevClient,
          pendingChanges: prevClient.pendingChanges.map((change) =>
            transform(message, change)
          ),
          lastSyncedRevision: data.revision,
        }));
        editor?.replaceRange(message.text, message.from_pos, message.to_pos);
      }
      if (message.type === OperationInputs.DELETE) {
        console.log("REVISION DELETE :: ", data.revision);

        setClient((prevClient) => ({
          ...prevClient,
          pendingChanges: prevClient.pendingChanges.map((change) =>
            transform(message, change)
          ),
          lastSyncedRevision: data.revision,
        }));
      }
    }
  };
  return s;
};
