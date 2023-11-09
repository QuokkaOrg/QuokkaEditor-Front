import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Redux/hooks";
import { useEffect } from "react";
import { getDocuments, getPageCount } from "../../../Redux/documentsSlice";
import axios from "axios";
import { API_URL } from "../../../consts";
import AddDocument from "../../molecules/addDocument/AddDocument";
import SearchBar from "../../atoms/searchBar/SearchBar";
import DocumentOptions from "../../molecules/documentsOptions/DocumentsOptions";
import DocumentsGrid from "../../molecules/documentsGrid/DocumentsGrid";

const Documents: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(API_URL + "documents/?page=1&size=18", {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => {
        dispatch(getDocuments(res.data.items));
        dispatch(getPageCount(res.data.pages));
      });
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
          className="flex justify-center mr-14 h-[91.111%] bg-project-beige-800 overflow-hidden hover:overflow-y-scroll"
          style={{ scrollbarGutter: "stable" }}
        >
          <DocumentsGrid />
        </div>
      </div>
    </div>
  );
};

export default Documents;
