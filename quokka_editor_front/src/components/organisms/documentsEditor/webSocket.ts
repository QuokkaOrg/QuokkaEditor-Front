import { ThunkDispatch } from "redux-thunk";
import {
  RemoteClients,
  UpdateClientType,
  addRemoteClient,
  deleteRemoteClient,
  getRemoteClients,
  updateRemoteClient,
} from "../../../Redux/clientsSlice";
import { OperationInputs, WEBSOCKET_URL } from "../../../consts";
import logger from "../../../logger";
import { ClientState, OperationType } from "../../../types/ot";
import { transform } from "./ot";
import { AnyAction, Dispatch } from "redux";
import { ProjectsState } from "../../../Redux/projectsSlice";
import { store } from "../../../Redux/store";
import { UserState } from "../../../Redux/userSlice";

export const createWebSocket = (
  id: string,
  editor: CodeMirror.Editor | null,
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
  const userToken = "?token=" + sessionStorage.getItem("userToken")?.slice(7);
  const s = new WebSocket(WEBSOCKET_URL + id + userToken);

  s.onopen = (e) => {
    logger.log("Connected to WebSocket, doc: ", id);
  };
  s.onclose = (e) => {
    logger.log("Disconnected from WebSocket");
  };
  s.onerror = (err) => {
    logger.error("Websocket Error: " + err);
  };
  s.onmessage = (e) => {
    const eventData = JSON.parse(e.data);

    if (eventData.type === "ACKNOWLEDGE") {
      setClient((prevClient) => ({
        ...prevClient,
        lastSyncedRevision: eventData.revision_log,
        sentChanges: null,
      }));
    } else if (eventData.message) {
      dispatchClients(deleteRemoteClient(eventData.user_token));
    } else if (eventData.type === "EXT_CHANGE") {
      const message: OperationType = eventData.data;
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
      const remoteClients = store.getState().clients.clients;
      if (Array.isArray(eventData) && !remoteClients) {
        dispatchClients(getRemoteClients(eventData));
      } else if (eventData.data) {
        const updatedClient: UpdateClientType = {
          user_token: eventData.user_token,
          ch: eventData.data.data.ch,
          line: eventData.data.data.line,
        };
        dispatchClients(updateRemoteClient(updatedClient));
      } else if (
        !remoteClients?.find(
          (client) => client.user_token === eventData.user_token
        )
      ) {
        dispatchClients(addRemoteClient(eventData));
      }
    }
  };
  return s;
};
