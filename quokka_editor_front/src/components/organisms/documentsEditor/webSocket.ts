import { ThunkDispatch } from "redux-thunk";
import {
  RemoteClient,
  RemoteClients,
  addRemoteClient,
  deleteRemoteClient,
  getRemoteClients,
  updateRemoteClient,
} from "../../../Redux/clientsSlice";
import { OperationInputs, WEBSOCKET_URL } from "../../../consts";
import logger from "../../../logger";
import { ClientState, CursorType } from "../../../types/ot";
import { transform } from "./ot";
import { AnyAction, Dispatch } from "redux";
import { DocumentsState } from "../../../Redux/documentsSlice";
import { store } from "../../../Redux/store";

export const createWebSocket = (
  id: string,
  editor: CodeMirror.Editor | null,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>,
  dispatchClients: ThunkDispatch<
    {
      documents: DocumentsState;
      clients: RemoteClients;
    },
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>
) => {
  const userToken = "?token=" + sessionStorage.getItem("userToken")?.slice(7);
  const s = new WebSocket(WEBSOCKET_URL + id + userToken);

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
    console.log(eventData);
    const remoteClients = store.getState().clients.clients;
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
      const message = JSON.parse(e.data);
      if (Array.isArray(message) && !remoteClients) {
        dispatchClients(getRemoteClients(message));
      } else if (
        !message.message &&
        message.user_token &&
        remoteClients &&
        !remoteClients.find(
          (client) => client.user_token === message.user_token
        )
      ) {
        dispatchClients(addRemoteClient(message));
      }
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
      const newCursor: CursorType = {
        ...eventData.data.data,
        user_token: eventData.user_token,
      };
      if (
        !remoteClients ||
        !remoteClients.find(
          (client) => client.user_token === newCursor.user_token
        )
      ) {
        //dispatchClients(addRemoteClient(newCursor));
      } else {
        dispatchClients(updateRemoteClient(newCursor));
      }
    }
  };
  return s;
};
