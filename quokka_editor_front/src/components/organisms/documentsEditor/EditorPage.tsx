import { useEffect, useState } from "react";
import DocumentsEditor from "./DocumentsEditor";
import { ClientState } from "../../../types/ot";
import { useLocation, useNavigate } from "react-router-dom";
import ShareProject from "./ShareProject";
import { ProjectState } from "../../../Redux/projectsSlice";
import { getSingleProject } from "../../../api";
import { handleEditorError } from "../../../errors";
import ProjectTitleUpdate from "./ProjectTitleUpdate";
import { DocumentType } from "../../../types/global";
import DocumentsList from "./DocumentsList";
import { useAppSelector } from "../../../Redux/hooks";
import AddDocument from "../../molecules/AddDocument";
import DeleteDocument from "../../molecules/DeleteDocument";

const initialClient = {
  lastSyncedRevision: 0,
  pendingChanges: [],
  sentChanges: null,
  documentState: "",
};

const initialProject = {
  title: "",
  content: " ",
  id: "",
  user_id: "",
  selected: false,
  shared_role: "READ",
  shared_by_link: false,
  images: [],
};

const initialDocument = {
  id: "",
  title: "",
  content: "",
  user_id: "",
  project_id: "",
  last_revision: 0,
};

const EditorPage = () => {
  const [client, setClient] = useState<ClientState>(initialClient);
  const [project, setProject] = useState<ProjectState>(initialProject);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [activeDocument, setActiveDocument] =
    useState<DocumentType>(initialDocument);
  const navigate = useNavigate();

  const location = useLocation();
  const id = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length
  );

  useEffect(() => {
    getSingleProject(id)
      .then((res) => {
        setDocuments(
          res.data.documents.map((document: DocumentType) => ({
            ...document,
            content: document.content
              ? JSON.parse(document.content).join("\n")
              : document.content,
          }))
        );
        setActiveDocument({
          ...res.data.documents[0],
          content: res.data.documents[0].content
            ? JSON.parse(res.data.documents[0].content).join("\n")
            : res.data.documents[0].content,
        });
        setProject(res.data.project);
      })
      .catch((err) => handleEditorError(err, navigate));
  }, []);

  useEffect(() => {
    setClient({
      ...client,
      documentState: activeDocument.content,
      lastSyncedRevision: activeDocument.last_revision,
    });
  }, [activeDocument]);

  return (
    <div id="EditorContainer" className="flex flex-col">
      <div id="EditorNavBar">
        <div className="flex justify-between items-center mx-6 bg-project-theme-dark-300 text-white m-5">
          <ProjectTitleUpdate
            id={id}
            title={project.title}
            setTitle={setProject}
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
          <ShareProject
            projectId={id}
            title={project.title}
            isShared={project.shared_by_link}
            sharedPrivileges={project.shared_role}
            setProjectPrivileges={setProject}
          />
        </div>
      </div>
      <div
        id="FilesBar"
        className="flex justify-between bg-project-there-dark-400 bg-[#3A3C4E] p-1"
      >
        <div className="flex">
          <img src="/typesrc.svg" className="mx-1" title="Documents List"></img>
          <DocumentsList
            documents={documents}
            activeDocumentId={activeDocument.id}
            setActiveDocument={setActiveDocument}
          />
        </div>
        <div className="flex mr-5">
          <DeleteDocument
            activeDocId={activeDocument.id}
            activeDocTitle={activeDocument.title}
            documents={documents}
            setDocuments={setDocuments}
            setActiveDocument={setActiveDocument}
          />
          <AddDocument project_id={project.id} setDocuments={setDocuments} />
        </div>
      </div>
      <DocumentsEditor
        client={client}
        setClient={setClient}
        id={id}
        editingDocument={activeDocument}
        setDocuments={setDocuments}
      />
    </div>
  );
};

export default EditorPage;
