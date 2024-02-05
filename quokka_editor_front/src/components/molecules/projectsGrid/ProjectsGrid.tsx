import PaginatedProjects from "./PaginatedProjects";
const ProjectsGrid: React.FC = () => {
  return (
    <div className="flex flex-col mx-24 my-4 w-full">
      <h3 className="font-bold text-lg text-white">Your Projects</h3>
      <PaginatedProjects />
    </div>
  );
};

export default ProjectsGrid;
