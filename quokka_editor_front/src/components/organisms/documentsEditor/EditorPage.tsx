import { useEffect, useState } from "react";
import DocumentsEditor from "./DocumentsEditor";
import { ClientState } from "../../../types/ot";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentTitleUpdate from "./DocumentTitleUpdate";
import ShareDocument from "./ShareDocument";
import { DocumentState } from "../../../Redux/documentsSlice";
import { getSingleDocument } from "../../../api";
import { handleEditorError } from "../../../errors";

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
  const navigate = useNavigate();

  const location = useLocation();
  const id = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length
  );

  useEffect(() => {
    getSingleDocument(id)
      .then((res) => {
        setClient({
          ...client,
          documentState: JSON.parse(res.data.content).join("\n"),
          lastSyncedRevision: JSON.parse(res.data.last_revision),
        });
        setDocument(res.data);
      })
      .catch((err) => handleEditorError(err, navigate));
  }, []);

  return (
    <div id="EditorContainer" className="flex flex-col">
      <div id="EditorNavBar">
        <div className="flex justify-between items-center mx-6 bg-project-theme-dark-300 text-white m-5">
          <DocumentTitleUpdate
            id={id}
            title={document.title}
            setTitle={setDocument}
          />
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
      </div>
      <div id="FilesBar" className="bg-project-there-dark-400 bg-[#3A3C4E] p-1">
        <img src="/typesrc.svg" className="ml-1"></img>
      </div>
      <DocumentsEditor
        client={client}
        setClient={setClient}
        id={id}
        editingDocument={document}
      />
    </div>
  );
};

export default EditorPage;
