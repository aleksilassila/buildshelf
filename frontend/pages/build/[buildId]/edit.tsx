import TitleBar from "../../../components/bars/TitleBar";
import useApi from "../../../components/hooks/api";
import {useRouter} from "next/router";

const Edit = () => {
  const router = useRouter();
  const { buildId } = router.query;

  const [build, loading, error] = useApi("/build/" + buildId, {}, [buildId]);

  return <div className="edit">
    <TitleBar />

  </div>
}

export default Edit;