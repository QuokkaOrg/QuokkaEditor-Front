import ReactPaginate from "react-paginate";
import { useAppSelector, useAppDispatch } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";
import { getProjects } from "../../../Redux/documentsSlice";
import { getPageOfProjects } from "../../../api";
import logger from "../../../logger";
import { useNavigate } from "react-router-dom";
import { handleDocumentsError } from "../../../errors";

type PageChange = {
  selected: number;
};

const PaginatedDocuments: React.FC = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.items);
  const pageCount = useAppSelector((state) => state.projects.pages);
  const initialPage = useAppSelector((state) => state.projects.page);
  const pageSize = useAppSelector((state) => state.projects.size);
  const paginationStyles = "bg-slate-400 rounded-xl py-2 px-4 m-1 font-bold";

  const navigate = useNavigate();

  const handlePageChange = (event: PageChange) => {
    const params = `?page=${event.selected + 1} &size=${pageSize}`;
    getPageOfProjects(params)
      .then((res) => {
        dispatch(getProjects(res.data));
      })
      .catch((err) => {
        logger.error(err);
        handleDocumentsError(err, navigate);
      });
  };

  return (
    <>
      <div className="flex flex-col items-start w-full">
        {projects.map(({ title, id, selected }, idx) => (
          <DocumentBox
            key={id}
            {...{ title, id, selected }}
            even={!!(idx % 2)}
          />
        ))}
      </div>
      <div className="m-2">
        <ReactPaginate
          nextLabel="&#11166;"
          onPageChange={handlePageChange}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="&#11164;"
          pageLinkClassName={paginationStyles}
          previousLinkClassName={paginationStyles}
          nextLinkClassName={paginationStyles}
          breakLabel="..."
          breakLinkClassName={paginationStyles}
          containerClassName="flex justify-center m-4"
          activeLinkClassName="border-2 border-slate-700"
          renderOnZeroPageCount={null}
          forcePage={initialPage - 1}
        />
      </div>
    </>
  );
};

export default PaginatedDocuments;
