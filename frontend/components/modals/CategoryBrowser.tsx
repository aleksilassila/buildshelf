import { useApi } from "../../utils/api";
import * as AlertDialog from "../ui/AlertDialog";

const CategoryBrowser = ({ show, setShow, setCategory }) => {
  const [categories, isLoading, isError] = useApi<{ name: string }[]>(
    "/categories",
    {},
    []
  );

  return <AlertDialog.Root open={show}>asd</AlertDialog.Root>;
};

export default CategoryBrowser;
