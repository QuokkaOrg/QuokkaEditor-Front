import ReactPaginate from "react-paginate";
import { useAppSelector, useAppDispatch } from "../../../Redux/hooks";
import DocumentBox from "../../atoms/documentBox/DocumentBox";
import axios from "axios";
import { API_URL } from "../../../consts";
import { getDocuments } from "../../../Redux/documentsSlice";

type PageChange = {
  selected: number;
};

const PaginatedDocuments: React.FC = () => {
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.documents);
  const pageCount = useAppSelector((state) => state.documents.pageCount);
  const paginationStyles = "bg-slate-400 rounded-xl py-2 px-4 m-1 font-bold";

  const handlePageChange = (event: PageChange) => {
    axios
      .get(API_URL + `documents/?page=${event.selected + 1}&size=18`, {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(getDocuments(res.data.items));
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
      />
    </>
  );
};

export default PaginatedDocuments;
