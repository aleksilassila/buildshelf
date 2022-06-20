import * as Dropdown from "../../ui/Dropdown";
import {useApi} from "../../../utils/api";
import {Category} from "../../../interfaces/ApiResponses";

const CategoriesDropdown = ({ doSearch }) => {
  const [categories, loading, error] = useApi<Category[]>(
    "/categories",
    {},
    []
  );

  return (
    <Dropdown.Root
      onValueChange={(category) => doSearch(category === "all" ? "" : category)}
      defaultValue="all"
    >
      <Dropdown.Group>
        <Dropdown.Label>Category</Dropdown.Label>
        <Dropdown.Item value="all">All Categories</Dropdown.Item>
        {categories?.map((item, index) => (
          <Dropdown.Item key={index} value={item.name}>
            {item.name
              ?.split("-")
              ?.map((w) => w[0].toUpperCase() + w.slice(1))
              ?.join(" ")}
          </Dropdown.Item>
        ))}
      </Dropdown.Group>
    </Dropdown.Root>
  );
};

export default CategoriesDropdown;
