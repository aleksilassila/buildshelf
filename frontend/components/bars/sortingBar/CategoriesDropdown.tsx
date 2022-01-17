import Dropdown from "../../common/Dropdown";
import {useApi} from "../../hooks/api";
import {Category} from "../../../interfaces/Builds";

const CategoriesDropdown = ({ category, doSearch }) => {
  const [categories, loading, error] = useApi<Category[]>(
    "/categories",
    {},
    []
  );

  const data = {
    items:
      !categories?.length
        ? [
          {
            content: "Error",
            onClick: () => {
            },
          },
        ]
        : [
          {
            content: "All Categories",
            onClick: () => doSearch(""),
          },
        ].concat(
          categories.map((c) => ({
            content: c.name.charAt(0).toUpperCase() + c.name.slice(1),
            onClick: () => doSearch(c.name),
          }))
        ),
  };

    return (
      <Dropdown data={data}>
        <div>
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "All Categories"}
        </div>
      </Dropdown>
    );
}

  export default CategoriesDropdown;