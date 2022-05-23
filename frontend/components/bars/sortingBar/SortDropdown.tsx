import * as Dropdown from "../../ui/Dropdown";
import Button from "../../ui/Button";

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
    <Dropdown.Root defaultValue="popular">
      <Dropdown.Group>
        <Dropdown.Label>Sort By</Dropdown.Label>
        <Dropdown.Item value="popular">Popular</Dropdown.Item>
        <Dropdown.Item value="top">Top</Dropdown.Item>
        <Dropdown.Item value="new">New</Dropdown.Item>
      </Dropdown.Group>
    </Dropdown.Root>
  );
};

export default SortDropdown;
