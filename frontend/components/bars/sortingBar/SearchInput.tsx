import Input from "../../ui/Input";
import { useState } from "react";
import SearchIcon from "../../icons/SearchIcon";
import { useRouter } from "next/router";

const SearchInput = ({ doSearch, placeholder }) => {
  const router = useRouter();
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
