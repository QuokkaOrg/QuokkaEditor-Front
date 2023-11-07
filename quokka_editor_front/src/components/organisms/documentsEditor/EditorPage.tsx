import { useEffect, useState } from "react";
import DocumentsEditor from "./DocumentsEditor";
import { ClientState } from "../../../types/ot";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../consts";
import DocumentTitleUpdate from "./DocumentTitleUpdate";

const initialClient = {
    lastSyncedRevision: 0,
    pendingChanges: [],
    sentChanges: null,
    documentState: "",
  };

const EditorPage = () => {
    const [client, setClient] = useState<ClientState>(initialClient);
    const [docTitle, setDocTitle] = useState<string>("");
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
        setDocTitle(res.data.title);
      });
  }, []);

    return <div id="EditorContainer" className="flex flex-col">
        <div id="NavBar" className="flex justify-between items-center mx-6 bg-project-theme-dark-300 text-white m-5">
            <DocumentTitleUpdate title={docTitle}/>
            <div className="flex text-[#B9B9B9]">
                <button className="mx-6 flex text-[25px]">File <img src="/arrow.svg" className="p-4"></img></button>
                <button className="mx-6 flex text-[25px]"> Edit <img src="/arrow.svg" className="p-4"></img></button>
                <button className="mx-6 flex text-[25px]">Insert <img src="/arrow.svg" className="p-4"></img></button>
            </div>
            {/* todo share onclick*/}
            <div className="flex select-none font-bold rounded-full pl-4 shadow hover:shadow-[0px_0px_8px_4px_rgba(75,75,75,0.15)] bg-project-theme-dark-350 justify-center items-center">
                    <h1>Share</h1>
                    <div className="ml-2 p-3 h-full shadow-[-3px_0px_8px_0px_rgba(0,0,0,0.)] rounded-full bg-project-theme-dark-400"><img src="/sharesrc.svg"></img></div>
            </div>
        </div>
        <div className="bg-project-there-dark-400 bg-[#3A3C4E] p-1">
            <img src="/typesrc.svg" className="ml-1"></img>
        </div>
        <DocumentsEditor client={client} setClient={setClient} id={id}/>
    </div>
}

export default EditorPage;