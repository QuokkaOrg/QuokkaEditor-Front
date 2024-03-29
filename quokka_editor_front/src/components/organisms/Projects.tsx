import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/hooks";
import { useEffect } from "react";
import { getProjects } from "../../Redux/projectsSlice";
import AddProject from "../molecules/AddProject";
import SearchBar from "../atoms/SearchBar";
import ProjectOptions from "../molecules/ProjectOptions";
import ProjectsGrid from "../molecules/projectsGrid/ProjectsGrid";
import { getPageOfProjects, getUser } from "../../api";
import { DEFAULT_PAGE_PARAMS, TOAST_OPTIONS } from "../../consts";
import logger from "../../logger";
import { ERRORS, handleDocumentsError } from "../../errors";
import Profile from "./Profile/Profile";
import { setUser } from "../../Redux/userSlice";
import toast from "react-hot-toast";

const Projects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const params = location.search ? location.search : DEFAULT_PAGE_PARAMS;
  useEffect(() => {
    getUser()
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => {
        toast.error(ERRORS.somethingWrong, TOAST_OPTIONS);
      });

    getPageOfProjects(params)
      .then((res) => {
        dispatch(getProjects(res.data));
      })
      .catch((err) => {
        logger.error(err);
        handleDocumentsError(err, navigate);
      });
  }, []);

  return (
    <div className="flex bg-project-theme-dark-300">
      <div id="options-panel" className="w-64 flex flex-col items-center mt-20">
        <AddProject />
        <ProjectOptions />
      </div>
      <div id="right-panel " className="w-full h-screen">
        <div id="top-bar" className="flex items-center justify-between h-20">
          <SearchBar />
          <Profile />
        </div>
        <div
          id="documents"
          className="flex  justify-center mr-14 h-[91.111%] bg-project-theme-dark-400 overflow-hidden hover:overflow-y-scroll"
          style={{ scrollbarGutter: "stable" }}
        >
          <ProjectsGrid />
        </div>
      </div>
    </div>
  );
};

export default Projects;
