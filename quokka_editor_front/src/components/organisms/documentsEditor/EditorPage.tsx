import { useEffect, useState } from "react";
import DocumentsEditor from "./DocumentsEditor";
import { ClientState } from "../../../types/ot";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../consts";
import DocumentTitleUpdate from "./DocumentTitleUpdate";
import ShareDocument from "./ShareDocument";
import { DocumentState } from "../../../Redux/documentsSlice";

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};

const initialDocument = {
  title: "",
  content: " ",
  id: "",
  selected: false,
  shared_role: "READ",
  shared_by_link: false,
};

const EditorPage = () => {
  const [client, setClient] = useState<ClientState>(initialClient);
  const [document, setDocument] = useState<DocumentState>(initialDocument);

  const location = useLocation();
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
        setClient({
          ...client,
          documentState: JSON.parse(res.data.content).join("\n"),
          lastSyncedRevision: JSON.parse(res.data.last_revision),
        });
        console.log(res.data);
        setDocument(res.data);
      });
  }, []);

  return (
    <div id="EditorContainer" className="flex flex-col">
      <div
        id="NavBar"
        className="flex justify-between items-center mx-6 bg-project-theme-dark-300 text-white m-5"
      >
        <DocumentTitleUpdate title={document.title} />
        <div className="flex text-[#B9B9B9]">
          <button className="mx-6 flex text-[25px]">
            File <img src="/arrow.svg" className="p-4"></img>
          </button>
          <button className="mx-6 flex text-[25px]">
            {" "}
            Edit <img src="/arrow.svg" className="p-4"></img>
          </button>
          <button className="mx-6 flex text-[25px]">
            Insert <img src="/arrow.svg" className="p-4"></img>
          </button>
        </div>
        {/* todo share onclick*/}
        <ShareDocument
          docId={id}
          title={document.title}
          isShared={document.shared_by_link}
          sharedPrivileges={document.shared_role}
          setDocumentPrivileges={setDocument}
        />
      </div>
      <div className="bg-project-there-dark-400 bg-[#3A3C4E] p-1">
        <img src="/typesrc.svg" className="ml-1"></img>
      </div>
      <DocumentsEditor client={client} setClient={setClient} id={id} />
    </div>
  );
};

export default EditorPage;
