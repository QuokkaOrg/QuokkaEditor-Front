import ProjectButton from "../atoms/ProjectButton";
import DeleteProject from "./DeleteProject";

const ProjectOptions: React.FC = () => {
  return (
    <div className="h-full mb-8 flex flex-col justify-between">
      <div className="flex flex-col">
        <ProjectButton>Shared</ProjectButton>
        <ProjectButton>Favourite</ProjectButton>
        <ProjectButton>Recent</ProjectButton>
      </div>
      <DeleteProject />
    </div>
  );
};

export default ProjectOptions;
