import Input from "../../common/Input";
import { useState } from "react";
import SearchIcon from "../../icons/SearchIcon";

const SearchInput = ({ doSearch, placeholder }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Input
      value={searchValue}
      setValue={setSearchValue}
      placeholder={placeholder}
      onEnter={() => doSearch(searchValue)}
      onBlur={() => doSearch(searchValue)}
    >
      <SearchIcon />
    </Input>
  );
};

export default SearchInput;