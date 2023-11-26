import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Redux/hooks";
import { useEffect } from "react";
import { getDocuments } from "../../../Redux/documentsSlice";
import AddDocument from "../../molecules/addDocument/AddDocument";
import SearchBar from "../../atoms/searchBar/SearchBar";
import DocumentOptions from "../../molecules/documentsOptions/DocumentsOptions";
import DocumentsGrid from "../../molecules/documentsGrid/DocumentsGrid";
import { getPageOfDocuments } from "../../../api";
import { DEFAULT_PAGE_PARAMS } from "../../../consts";
import logger from "../../../logger";
import { handleDocumentsError } from "../../../errors";

const Documents: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const params = location.search ? location.search : DEFAULT_PAGE_PARAMS;
  useEffect(() => {
    getPageOfDocuments(params)
      .then((res) => {
        dispatch(getDocuments(res.data));
      })
      .catch((err) => {
        logger.error(err);
        handleDocumentsError(err, navigate);
      });
  }, []);

  const logoutAction = () => {
    sessionStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="flex bg-project-theme-dark-300">
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
          className="flex justify-center mr-14 h-[91.111%] bg-project-theme-dark-400 overflow-hidden hover:overflow-y-scroll"
          style={{ scrollbarGutter: "stable" }}
        >
          <DocumentsGrid />
        </div>
      </div>
    </div>
  );
};

export default Documents;
