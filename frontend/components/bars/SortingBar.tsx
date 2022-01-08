import theme from "../../constants/theme";
import Dropdown from "../common/Dropdown";
import { useState } from "react";
import Sort from "../icons/Sort";
import SortDown from "../icons/SortDown";
import Center from "../utils/Center";
import NBSP from "../utils/NBSP";
import Input from "../common/Input";

const SortingBar = ({ SortDropdown, SearchInput, RightButton, }) => {
  // const [searchValue, setSearchValue] = useState("");

  // const SortDropdown = (
  //   <Dropdown
  //     data={{
  //       items: [
  //         {
  //           content: "Top",
  //           onClick: () => setSortBy("Top"),
  //         },
  //         {
  //           content: "Popular",
  //           onClick: () => setSortBy("Top"),
  //         },
  //         {
  //           content: "New",
  //           onClick: () => setSortBy("New"),
  //         },
  //       ],
  //     }}
  //   >
  //     <Center>
  //       <Sort />
  //       {NBSP}
  //       {sortBy}
  //     </Center>
  //   </Dropdown>
  // );
  //
  // const SearchInput = (
  //   <Input
  //     value={searchValue}
  //     setValue={setSearchValue}
  //     placeholder={"Search builds by title"}
  //     onEnter={doSearch(searchValue)}
  //   />
  // );

  return (
    <div className="sorting-bar">
      <div className="left">
        <div className="space">
          {SortDropdown}
        </div>
        {SearchInput}
      </div>
      {RightButton}
      <style jsx>
        {`
          .sorting-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .space {
            margin-right: 0.5em;
          }

          .left {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};

export default SortingBar;
