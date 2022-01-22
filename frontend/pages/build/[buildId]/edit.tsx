import TitleBar from "../../../components/bars/TitleBar";
import {useRouter} from "next/router";
import {useApi} from "../../../components/hooks/api";

const Edit = () => {
  const router = useRouter();
  const { buildId } = router.query;

  const [build, loading, error] = useApi("/build/" + buildId, {}, [buildId]);

  return <div className="edit">
    <TitleBar />

  </div>
}

export default Edit;