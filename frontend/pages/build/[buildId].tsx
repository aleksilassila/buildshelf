import { useRouter } from "next/router";
import TitleBar from "../../components/bars/TitleBar";
import useAxios from "axios-hooks";
import * as BuildPage from "../../components/BuildPage";

const Build = ({}) => {
  const router = useRouter();
  const { buildId } = router.query;

  const [{ data, loading, error }, refetch] = useAxios(
    process.env.BACKEND_ENDPOINT + `/builds/${buildId}`
  );

  return (
    <div>
      <TitleBar />
      <BuildPage.Static buildId={buildId} />
    </div>
  );
};

export default Build;
