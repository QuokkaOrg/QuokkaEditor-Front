import ReactPaginate from "react-paginate";
import { useAppSelector, useAppDispatch } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";
import { getDocuments } from "../../../Redux/documentsSlice";
import { getPageOfDocuments } from "../../../api";
import logger from "../../../logger";
import { useNavigate } from "react-router-dom";
import { handleDocumentsError } from "../../../errors";

type PageChange = {
  selected: number;
};

const PaginatedDocuments: React.FC = () => {
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.items);
  const pageCount = useAppSelector((state) => state.documents.pages);
  const initialPage = useAppSelector((state) => state.documents.page);
  const pageSize = useAppSelector((state) => state.documents.size);
  const paginationStyles = "bg-slate-400 rounded-xl py-2 px-4 m-1 font-bold";

  const navigate = useNavigate();

  const handlePageChange = (event: PageChange) => {
    const params = `?page=${event.selected + 1} &size=${pageSize}`;
    getPageOfDocuments(params)
      .then((res) => {
        dispatch(getDocuments(res.data));
      })
      .catch((err) => {
        logger.error(err);
        handleDocumentsError(err, navigate);
      });
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        {documents.map(({ title, id, selected }) => (
          <DocumentBox key={id} {...{ title, id, selected }} />
        ))}
      </div>
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
    </>
  );
};

export default PaginatedDocuments;
