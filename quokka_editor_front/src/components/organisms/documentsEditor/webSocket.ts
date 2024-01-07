import { ThunkDispatch } from "redux-thunk";
import {
  RemoteClient,
  RemoteClients,
  addRemoteClient,
  deleteRemoteClient,
  updateRemoteClient,
} from "../../../Redux/clientsSlice";
import { OperationInputs, WEBSOCKET_URL } from "../../../consts";
import logger from "../../../logger";
import { ClientState, CursorType, OperationType } from "../../../types/ot";
import { transform } from "./ot";
import { AnyAction, Dispatch } from "redux";
import { DocumentsState, ProjectsState } from "../../../Redux/documentsSlice";
import { store } from "../../../Redux/store";
import { DocumentType } from "../../../types/global";
import { UserState } from "../../../Redux/userSlice";

export const createWebSocket = (
  id: string,
  editor: CodeMirror.Editor | null,
  username: string,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>,
  dispatchClients: ThunkDispatch<
    {
      projects: ProjectsState;
      clients: RemoteClients;
      user: UserState;
    },
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>
) => {
  const userToken = "&token=" + sessionStorage.getItem("userToken")?.slice(7);
  const usernameParam = "?username=" + username;
  const s = new WebSocket(WEBSOCKET_URL + id + usernameParam + userToken);

  s.onopen = (e) => {
    logger.log("Connected to WebSocket");
  };
  s.onclose = (e) => {
    logger.log("Disconnected from WebSocket");
  };
  s.onerror = (err) => {
    logger.error("Websocket Error: " + err);
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
      dispatchClients(deleteRemoteClient(eventData.user_token));
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
      const remoteClients = store.getState().clients.clients;
      if (
        !remoteClients ||
        !remoteClients.find((client) => client.token === remoteCursor.token)
      ) {
        dispatchClients(addRemoteClient(remoteCursor));
      } else {
        dispatchClients(updateRemoteClient(remoteCursor));
      }
    }
  };
  return s;
};
