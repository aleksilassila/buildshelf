import Dropdown from "../../common/Dropdown";

const SortDropdown = ({ sort, doSearch }) => {
  const data = {
        items: [
          {
            content: "Top",
            onClick: () => doSearch("Top"),
          },
          {
            content: "Popular",
            onClick: () => doSearch("Top"),
          },
          {
            content: "New",
            onClick: () => doSearch("New"),
          },
        ],
      };

  return (
    <Dropdown
      data={data}
    >
      {sort}
    </Dropdown>
  )};

export default SortDropdown;