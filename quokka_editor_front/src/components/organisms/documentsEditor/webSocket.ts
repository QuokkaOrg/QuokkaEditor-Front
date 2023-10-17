import { ClientState, Operation } from "../../../types/ot";

export const createWebSocket = (
  id: string,
  editor: CodeMirror.Editor | null,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>
) => {
  const s = new WebSocket("wss://damian-quokka-backend.eu.ngrok.io/ws" + id);
  s.onopen = (e) => console.log("Connected to WebSocket");
  s.onclose = (e) => console.log("Disconnected from WebSocket");
  s.onerror = (err) => console.error("Websocket Error: " + err);
  s.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type !== "cursor") {
      const message: Operation = JSON.parse(e.data);
      if (message.text) {
        editor?.replaceRange(message.text, message.from_pos, message.to_pos);
      }
      if (message.type === "DELETE") {
        setClient((prevClient) => ({
          ...prevClient,
          documentState: prevClient.documentState,
        }));
      }
    }
  };
  return s;
};
