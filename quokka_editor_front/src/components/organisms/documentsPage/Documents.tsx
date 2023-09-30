import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useEffect } from "react";
import { getDocuments } from "../../../Redux/documentsSlice";
import axios from "axios";
import { API_URL } from "../../../consts";
import DeleteDocument from "../../molecules/deleteDocument/DeleteDocument";
import AddDocument from "../../molecules/addDocument/AddDocument";
import SearchBar from "../../atoms/searchBar/SearchBar";
import DocumentOptions from "../../molecules/documentsOptions/DocumentsOptions";
import DocumentsGrid from "../../molecules/documentsGrid/DocumentsGrid";

const Documents: React.FC = () => {
  const navigate = useNavigate();

  const documentsState = useAppSelector((state) => state.documents);
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(API_URL + "documents", {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => dispatch(getDocuments(res.data)));
  }, []);

  const logoutAction = () => {
    sessionStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="flex">
      <div id="options-panel" className="w-64 flex flex-col items-center mt-20">
        <AddDocument />
        <DocumentOptions />
      </div>
      <div id="right-panel " className="w-full h-screen">
        <div id="top-bar" className="flex items-center justify-between h-20">
          <SearchBar />
          <button type="button" onClick={logoutAction}>
            Logout
          </button>
        </div>
        <div
          id="documents"
          className="flex justify-center mr-14 h-5/6 bg-project-beige-800 overflow-hidden hover:overflow-y-scroll"
          style={{ scrollbarGutter: "stable" }}
        >
          <DocumentsGrid />
        </div>
      </div>
    </div>
  );
};

export default Documents;
