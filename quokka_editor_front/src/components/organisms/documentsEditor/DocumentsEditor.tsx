import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../consts";
import { useLocation } from "react-router-dom";

type Operation = {
  type: "INSERT" | "DELETE";
  char?: string;
  pos: number;
  revision: number;
};

type Ack = {
  message: "ACK";
  revision_log: number;
};

type MessageOrAck = Operation & Ack;

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

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};
const initialServer = {
  pendingChanges: [],
  revisionLog: [],
  documentState: "",
};

const insertAt = (str: string, index: number, insertion: string) => {
  if (index < 0 || index > str.length) {
    return str;
  }
  return str.slice(0, index) + insertion + str.slice(index);
};

const removeAt = (str: string, index: number) => {
  if (index < 0 || index >= str.length) {
    return str;
  }
  return str.slice(0, index) + str.slice(index + 1);
};

const DocumentsEditor: React.FC = () => {
  const location = useLocation();
  const [document, setDocument] = useState({ id: "", title: "", content: "" });
  const [client, setClient] = useState<ClientState>(initialClient);
  const [socket, setSocket] = useState<WebSocket>();

  const id = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length
  );

  useEffect(() => {
    axios
      .get(API_URL + "documents" + id, {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => {
        console.log(res.data);
        setDocument(res.data);
        setClient({ ...client, documentState: res.data.content });
      });
  }, []);

  useEffect(() => {
    const s = new WebSocket("ws://localhost:8100/ws" + id);
    s.onopen = (e) => console.log("Connected to WebSocket");
    s.onclose = (e) => console.log("Disconnected from WebSocket");
    s.onerror = (err) => console.error("Websocket Error: " + err);
    s.onmessage = (e) => {
      console.log("Message", e.data);
      const message = JSON.parse(e.data);
      if (message.char) {
        setClient((prevClient) => ({
          ...client,
          documentState: insertAt(
            prevClient.documentState,
            message.pos,
            message.char
          ),
        }));
      }
      if (message.type === "DELETE") {
        setClient((prevClient) => ({
          ...client,
          documentState: removeAt(prevClient.documentState, message.pos),
        }));
      }
    };
    setSocket(s);
    return () => s.close();
  }, []);

  const onChangeHandler = (event: InputEvent) => {
    const pos = (event.target as HTMLInputElement).selectionStart || 0;
    if (event.inputType === "insertText") {
      socket?.send(
        JSON.stringify({
          type: "INSERT",
          char: event.data || "",
          pos: pos - 1,
          revision: 0,
        })
      );
      setClient({
        ...client,
        documentState: insertAt(
          client.documentState,
          pos - 1,
          event.data || ""
        ),
      });
    } else if (event.inputType === "deleteContentBackward") {
      socket?.send(
        JSON.stringify({
          type: "DELETE",
          pos: pos,
          revision: 0,
        })
      );
      setClient({
        ...client,
        documentState: removeAt(client.documentState, pos),
      });
    }
  };

  return (
    <div className="flex place-content-center h-screen">
      <textarea
        className="w-3/5 h-2/5"
        value={client.documentState}
        onChange={(event) => onChangeHandler(event.nativeEvent as InputEvent)}
      ></textarea>
    </div>
  );
};

// const DocumentsEditor: React.FC = () => {
//   const location = useLocation();
//   const [document, setDocument] = useState({ id: "", title: "", content: "" });

//   const [aliceState, setAliceState] = useState<ClientState>(initialClient);
//   const [bobState, setBobState] = useState<ClientState>(initialClient);
//   const [serverState, setServerState] = useState<ServerState>(initialServer);
//   const [operation, setOperation] = useState<Operation | null>(null);

//   useEffect(() => {
//     const id = location.pathname.slice(
//       location.pathname.lastIndexOf("/"),
//       location.pathname.length
//     );
//     axios
//       .get(API_URL + "documents" + id, {
//         headers: { Authorization: sessionStorage.getItem("userToken") },
//       })
//       .then((res) => setDocument(res.data));
//   }, [location]);

//   const onChangeHandler = (event: InputEvent) => {
//     console.log(event.inputType);
//     console.log((event.target as HTMLInputElement).selectionStart);
//     const pos = (event.target as HTMLInputElement).selectionStart || 0;
//     const name = (event.target as HTMLInputElement).name || "";
//     if (event.inputType === "insertText") {
//       setOperation({
//         type: "INSERT",
//         message: event.data || "",
//         position: pos - 1,
//         client: name,
//       });
//     }
//     // else if (event.inputType === "deleteContentBackward") {
//     // }
//   };

//   const addToPending = () => {
//     if (operation?.client === "alice") {
//       setAliceState({
//         ...aliceState,
//         pendingChanges: [...aliceState.pendingChanges, operation],
//         documentState: aliceState.documentState + operation.message,
//       });
//     } else if (operation?.client === "bob") {
//       setBobState({
//         ...bobState,
//         pendingChanges: [...bobState.pendingChanges, operation],
//         documentState: bobState.documentState + operation.message,
//       });
//     }
//     setOperation(null);
//   };

//   const sendChanges = (client: string) => {
//     if (client === "alice") {
//       const opToSend = aliceState.pendingChanges[0];
//       setOperation(opToSend);
//       setAliceState({
//         ...aliceState,
//         sentChanges: opToSend,
//         pendingChanges: aliceState.pendingChanges.slice(1),
//       });
//       setServerState({
//         ...serverState,
//         pendingChanges: [...serverState.pendingChanges, opToSend],
//       });
//     } else if (client === "bob") {
//       const opToSend = bobState.pendingChanges[0];
//       setOperation(opToSend);
//       setBobState({
//         ...bobState,
//         sentChanges: opToSend,
//         pendingChanges: bobState.pendingChanges.slice(1),
//       });
//       setServerState({
//         ...serverState,
//         pendingChanges: [...serverState.pendingChanges, opToSend],
//       });
//     }
//   };

//   const syncChanges = () => {
//     serverState.pendingChanges.map((change) => {
//       if (change.client === "alice") {
//         setAliceState({
//           ...aliceState,
//           lastSyncedRevision: aliceState.lastSyncedRevision++,
//         });

//         console.log(change.client + "ACK");
//       } else if (change.client === "bob") {
//         setBobState({
//           ...bobState,
//           lastSyncedRevision: bobState.lastSyncedRevision++,
//         });

//         console.log(change.client + "ACK");
//       }
//     });
//     setServerState({
//       ...serverState,
//       revisionLog: [...serverState.revisionLog, serverState.pendingChanges[0]],
//       documentState:
//         serverState.documentState + serverState.pendingChanges[0].message,
//       pendingChanges: serverState.pendingChanges.slice(1),
//     });
//   };

//   return (
//     <div>
//       <h1>{document.title}</h1>
//       <div className="flex justify-evenly">
//         <div>
//           <h2>Alice</h2>
//           <textarea
//             name="alice"
//             id="alice"
//             cols={50}
//             rows={10}
//             onChange={(event) =>
//               onChangeHandler(event.nativeEvent as InputEvent)
//             }
//           >
//             {aliceState.documentState}
//           </textarea>
//         </div>
//         <div>
//           <h2>Bob</h2>
//           <textarea
//             name="bob"
//             id="bob"
//             cols={50}
//             rows={10}
//             onChange={(event) =>
//               onChangeHandler(event.nativeEvent as InputEvent)
//             }
//           >
//             {bobState.documentState}
//           </textarea>
//         </div>
//       </div>
//       <div className="flex justify-around mb-5">
//         <div>
//           <h2 className="font-bold">Alice operations</h2>
//           <button
//             type="button"
//             className="p-2 border border-black"
//             onClick={addToPending}
//           >
//             add to pending
//           </button>
//           <button
//             type="button"
//             className="p-2 border border-black"
//             onClick={() => sendChanges("alice")}
//           >
//             send changes
//           </button>
//         </div>
//         <div>
//           <h2 className="font-bold">Server operations</h2>
//           <button type="button" className="p-2 border border-black">
//             Sync changes
//           </button>
//         </div>
//         <div>
//           <h2 className="font-bold">Bob operations</h2>
//           <button
//             type="button"
//             className="p-2 border border-black"
//             onClick={addToPending}
//           >
//             add to pending
//           </button>
//           <button
//             type="button"
//             className="p-2 border border-black"
//             onClick={() => sendChanges("bob")}
//           >
//             send changes
//           </button>
//         </div>
//       </div>
//       <hr className="border-black" />
//       <div className="flex justify-around mt-5">
//         <div>
//           <h2 className="font-bold">Alice state</h2>
//           <p>Last synced revision: {aliceState?.lastSyncedRevision}</p>
//           <div>
//             Pending Changes:{" "}
//             {aliceState.pendingChanges.map(
//               ({ message, position, type }, idx) => (
//                 <p key={idx}>
//                   {"{type: " +
//                     type +
//                     ", message: " +
//                     message +
//                     ", position: " +
//                     position +
//                     "}, "}
//                 </p>
//               )
//             )}
//           </div>
//           <p>
//             Sent Changes: {"{"}Message: {aliceState.sentChanges?.message},{" "}
//             Position: {aliceState.sentChanges?.position}, Type:{" "}
//             {aliceState.sentChanges?.type}
//             {"}"}
//           </p>
//         </div>
//         <div>
//           <h2 className="font-bold">Server state</h2>
//           <p>Revision Log:</p>
//           <div>
//             Pending Changes:{" "}
//             {serverState.pendingChanges.map(
//               ({ client, message, position, type }, idx) => (
//                 <p key={idx}>
//                   {"{type: " +
//                     type +
//                     ", message: " +
//                     message +
//                     ", position: " +
//                     position +
//                     ", client: " +
//                     client +
//                     "}"}
//                 </p>
//               )
//             )}
//           </div>
//         </div>
//         <div>
//           <h2 className="font-bold">Bob state</h2>
//           <p>Last synced revision: {bobState?.lastSyncedRevision}</p>
//           <div>
//             Pending Changes:{" "}
//             {bobState.pendingChanges.map(({ message, position, type }, idx) => (
//               <p key={idx}>
//                 {"{type: " +
//                   type +
//                   ", message: " +
//                   message +
//                   ", position: " +
//                   position +
//                   "}, "}
//               </p>
//             ))}
//           </div>
//           <p>
//             Sent Changes: {"{"}Message: {bobState.sentChanges?.message},{" "}
//             Position: {bobState.sentChanges?.position}, Type:{" "}
//             {bobState.sentChanges?.type}
//             {"}"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

export default DocumentsEditor;
