import { getPageOfProjects } from "../../../api";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import { getProjects } from "../../../Redux/projectsSlice";
import { DEFAULT_PAGE_PARAMS } from "../../../consts";

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    const searchParams = searchValue
      ? `?search_phrase=${searchValue}&size=14`
      : DEFAULT_PAGE_PARAMS;
    getPageOfProjects(searchParams).then((res) =>
      dispatch(getProjects(res.data))
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
