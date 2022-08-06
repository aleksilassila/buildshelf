import Input, { InputIcon } from "../../ui/Input";
import { HTMLAttributes, useState } from "react";
import { useRouter } from "next/router";
import AwesomeIcon from "../../icons/AwesomeIcon";

interface Props extends HTMLAttributes<HTMLInputElement> {
  placeholder: string;
  doSearch: (value: string) => void;
}

const SearchInput = (props: Props) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  return (
    <Input
      value={searchValue}
      setValue={setSearchValue}
      placeholder={props.placeholder}
      onEnter={() => props.doSearch(searchValue)}
      onBlur={() => props.doSearch(searchValue)}
      className={`${props.className}`}
    >
      <InputIcon>
        <AwesomeIcon icon="faSearch" className="text-sm" />
      </InputIcon>
    </Input>
  );
};

export default SearchInput;
