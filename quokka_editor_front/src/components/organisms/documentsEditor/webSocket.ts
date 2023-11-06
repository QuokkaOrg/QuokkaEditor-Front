import { OperationInputs, WEBSOCKET_URL } from "../../../consts";
// import logger from "../../../logger";
import { ClientState, CursorType, OperationType } from "../../../types/ot";
import { transform } from "./ot";

export const createWebSocket = (
  id: string,
  editor: CodeMirror.Editor | null,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>,
  setRemoteCursors: React.Dispatch<React.SetStateAction<CursorType[] | null>>
) => {
  const userToken = "?token=" + sessionStorage.getItem("userToken")?.slice(7);
  const s = new WebSocket(WEBSOCKET_URL + id + userToken);
  //TODO fix logger
  s.onopen = (e) => {
    // logger.log({ level: "info", message: "Connected to WebSocket" });
  };
  s.onclose = (e) => {
    // logger.log({ level: "info", message: "Disconnected from WebSocket" });
  };
  s.onerror = (err) => {
    // logger.log({ level: "error", message: "Websocket Error: " + err });
  };
  s.onmessage = (e) => {
    const eventData = JSON.parse(e.data);

    if (eventData.message === "ACK") {
      setClient((prevClient) => ({
        ...prevClient,
        lastSyncedRevision: eventData.revision_log,
        sentChanges: null,
      }));
    } else if (eventData.message) {
      setRemoteCursors((currCursors) => {
        if (!currCursors) return null;
        return currCursors.filter(
          (cursor) => cursor.token === eventData.user_token
        );
      });
    }
    if (!eventData.data) {
      const message: OperationType = JSON.parse(e.data);
      if (message.text) {
        setClient((prevClient) => ({
          ...prevClient,
          pendingChanges: prevClient.pendingChanges.map((change) =>
            transform(message, change)
          ),
          lastSyncedRevision: eventData.revision,
        }));
        editor?.replaceRange(message.text, message.from_pos, message.to_pos);
      }
      if (message.type === OperationInputs.DELETE) {
        setClient((prevClient) => ({
          ...prevClient,
          pendingChanges: prevClient.pendingChanges.map((change) =>
            transform(message, change)
          ),
          lastSyncedRevision: eventData.revision,
        }));
      }
    } else {
      const cursorData = eventData.data;
      const remoteCursor: CursorType = {
        token: eventData.user_token,
        ch: cursorData.data.ch,
        line: cursorData.data.line,
      };

      setRemoteCursors((currCursors) => {
        if (!currCursors) return [remoteCursor];
        if (
          !currCursors.find((cursor) => cursor.token === remoteCursor.token)
        ) {
          return [...currCursors, remoteCursor];
        } else {
          const updatedCursors = currCursors.map((cursor) => {
            if (cursor.token === remoteCursor.token) return remoteCursor;
            else return cursor;
          });

          return updatedCursors;
        }
      });
    }
  };
  return s;
};
