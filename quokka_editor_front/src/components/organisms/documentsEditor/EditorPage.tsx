import { useEffect, useState } from "react";
import DocumentsEditor from "./DocumentsEditor";
import { ClientState } from "../../../types/ot";
import { useLocation, useNavigate } from "react-router-dom";
import ShareDocument from "./ShareDocument";
import { ProjectState } from "../../../Redux/documentsSlice";
import { getSingleProject } from "../../../api";
import { handleEditorError } from "../../../errors";
import ProjectTitleUpdate from "./DocumentTitleUpdate";

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

const EditorPage = () => {
  const [client, setClient] = useState<ClientState>(initialClient);
  const [project, setProject] = useState<ProjectState>(initialProject);
  const navigate = useNavigate();

  const location = useLocation();
  const id = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length
  );

  useEffect(() => {
    getSingleProject(id)
      .then((res) => {
        console.log(res.data.documents);
        // setClient({
        //   ...client,
        //   documentState: JSON.parse(res.data.content).join("\n"),
        //   lastSyncedRevision: JSON.parse(res.data.last_revision),
        // });
        setProject(res.data.project);
      })
      .catch((err) => handleEditorError(err, navigate));
  }, []);

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
          <ShareDocument
            projectId={id}
            title={project.title}
            isShared={project.shared_by_link}
            sharedPrivileges={project.shared_role}
            setProjectPrivileges={setProject}
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
