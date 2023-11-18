import { getPageOfDocuments } from "../../../api";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import { getDocuments } from "../../../Redux/documentsSlice";
import { DEFAULT_PAGE_PARAMS } from "../../../consts";

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    const searchParams = searchValue
      ? `?search_phrase=${searchValue}&size=18`
      : DEFAULT_PAGE_PARAMS;
    getPageOfDocuments(searchParams).then((res) =>
      dispatch(getDocuments(res.data))
    );
  }, [searchValue]);

  const searchChangeHandler = (value: string) => {
    setSearchValue(value);
  };

  return (
    <input
      type="text"
      value={searchValue}
      name="search"
      placeholder="Search"
      onChange={(e) => searchChangeHandler(e.target.value)}
      className="w-1/3 p-2 pl-8 rounded-full bg-project-theme-dark-200 focus:outline-none focus:border-project-window-bonus-100 focus:ring-1 text-white"
    />
  );
};

export default SearchBar;
