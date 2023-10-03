import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../consts";
import { useLocation } from "react-router-dom";

type Operation = {
  type: "INSERT" | "DELETE";
  message: string;
  position: number;
  client: string;
};

type ClientState = {
  lastSyncedRevision: number;
  pendingChanges: Operation[];
  sentChanges: Operation | null;
  documentState: string;
};

type ServerState = {
  pendingChanges: Operation[];
  revisionLog: Operation[];
  documentState: string;
};

const DocumentsEditor: React.FC = () => {
  const location = useLocation();
  const [document, setDocument] = useState({ id: "", title: "", content: "" });

  const [aliceState, setAliceState] = useState<ClientState>({
    lastSyncedRevision: 0,
    pendingChanges: [],
    sentChanges: null,
    documentState: "",
  });
  const [bobState, setBobState] = useState<ClientState>({
    lastSyncedRevision: 0,
    pendingChanges: [],
    sentChanges: null,
    documentState: "",
  });
  const [serverState, setServerState] = useState<ServerState>({
    pendingChanges: [],
    revisionLog: [],
    documentState: "",
  });
  const [operation, setOperation] = useState<Operation>();

  useEffect(() => {
    const id = location.pathname.slice(
      location.pathname.lastIndexOf("/"),
      location.pathname.length
    );
    axios
      .get(API_URL + "documents" + id, {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => setDocument(res.data));
  }, [location]);

  const onChangeHandler = (event: InputEvent) => {
    console.log(event.inputType);
    console.log((event.target as HTMLInputElement).selectionStart);
    const pos = (event.target as HTMLInputElement).selectionStart || 0;
    const name = (event.target as HTMLInputElement).name || "";
    if (event.inputType === "insertText") {
      setOperation({
        type: "INSERT",
        message: event.data || "",
        position: pos - 1,
        client: name,
      });
    }
    // else if (event.inputType === "deleteContentBackward") {
    // }
  };

  const addToPending = () => {
    if (operation?.client === "alice") {
      setAliceState({
        ...aliceState,
        pendingChanges: [...aliceState.pendingChanges, operation],
        documentState: aliceState.documentState + operation.message,
      });
    } else if (operation?.client === "bob") {
      setBobState({
        ...bobState,
        pendingChanges: [...bobState.pendingChanges, operation],
        documentState: bobState.documentState + operation.message,
      });
    }
  };

  const sendChanges = (client: string) => {
    if (client === "alice") {
      const opToSend = aliceState.pendingChanges[0];
      setOperation(opToSend);
      setAliceState({
        ...aliceState,
        sentChanges: opToSend,
        pendingChanges: aliceState.pendingChanges.slice(1),
      });
      setServerState({
        ...serverState,
        pendingChanges: [...serverState.pendingChanges, opToSend],
      });
    } else if (client === "bob") {
      const opToSend = bobState.pendingChanges[0];
      setOperation(opToSend);
      setBobState({
        ...bobState,
        sentChanges: opToSend,
        pendingChanges: bobState.pendingChanges.slice(1),
      });
      setServerState({
        ...serverState,
        pendingChanges: [...serverState.pendingChanges, opToSend],
      });
    }
  };

  return (
    <div>
      <h1>{document.title}</h1>
      <div className="flex justify-evenly">
        <div>
          <h2>Alice</h2>
          <textarea
            name="alice"
            id="alice"
            cols={50}
            rows={10}
            onChange={(event) =>
              onChangeHandler(event.nativeEvent as InputEvent)
            }
          ></textarea>
        </div>
        <div>
          <h2>Bob</h2>
          <textarea
            name="bob"
            id="bob"
            cols={50}
            rows={10}
            onChange={(event) =>
              onChangeHandler(event.nativeEvent as InputEvent)
            }
          ></textarea>
        </div>
      </div>
      <div className="flex justify-around mb-5">
        <div>
          <h2 className="font-bold">Alice operations</h2>
          <button
            type="button"
            className="p-2 border border-black"
            onClick={addToPending}
          >
            add to pending
          </button>
          <button
            type="button"
            className="p-2 border border-black"
            onClick={() => sendChanges("alice")}
          >
            send changes
          </button>
        </div>
        <div>
          <h2 className="font-bold">Server operations</h2>
          <button type="button" className="p-2 border border-black">
            Sync changes
          </button>
        </div>
        <div>
          <h2 className="font-bold">Bob operations</h2>
          <button
            type="button"
            className="p-2 border border-black"
            onClick={addToPending}
          >
            add to pending
          </button>
          <button
            type="button"
            className="p-2 border border-black"
            onClick={() => sendChanges("bob")}
          >
            send changes
          </button>
        </div>
      </div>
      <hr className="border-black" />
      <div className="flex justify-around mt-5">
        <div>
          <h2 className="font-bold">Alice state</h2>
          <p>Last synced revision: {aliceState?.lastSyncedRevision}</p>
          <div>
            Pending Changes:{" "}
            {aliceState.pendingChanges.map(
              ({ message, position, type }, idx) => (
                <p key={idx}>
                  {"{type: " +
                    type +
                    ", message: " +
                    message +
                    ", position: " +
                    position +
                    "}, "}
                </p>
              )
            )}
          </div>
          <p>
            Sent Changes: {"{"}Message: {aliceState.sentChanges?.message},{" "}
            Position: {aliceState.sentChanges?.position}, Type:{" "}
            {aliceState.sentChanges?.type}
            {"}"}
          </p>
        </div>
        <div>
          <h2 className="font-bold">Server state</h2>
          <p>Revision Log:</p>
          <div>
            Pending Changes:{" "}
            {serverState.pendingChanges.map(
              ({ client, message, position, type }, idx) => (
                <p key={idx}>
                  {"{type: " +
                    type +
                    ", message: " +
                    message +
                    ", position: " +
                    position +
                    ", client: " +
                    client +
                    "}"}
                </p>
              )
            )}
          </div>
        </div>
        <div>
          <h2 className="font-bold">Bob state</h2>
          <p>Last synced revision: {bobState?.lastSyncedRevision}</p>
          <div>
            Pending Changes:{" "}
            {bobState.pendingChanges.map(({ message, position, type }, idx) => (
              <p key={idx}>
                {"{type: " +
                  type +
                  ", message: " +
                  message +
                  ", position: " +
                  position +
                  "}, "}
              </p>
            ))}
          </div>
          <p>
            Sent Changes: {"{"}Message: {bobState.sentChanges?.message},{" "}
            Position: {bobState.sentChanges?.position}, Type:{" "}
            {bobState.sentChanges?.type}
            {"}"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsEditor;
