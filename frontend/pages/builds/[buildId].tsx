import {useRouter} from "next/router";
import TitleBar from "../../components/bars/TitleBar";
import * as BuildPage from "../../components/BuildPage";

const Build = ({}) => {
  const router = useRouter();
  //@ts-ignore
  const { buildId }: { buildId: string } = router.query;

  return (
    <div>
      <TitleBar />
      <BuildPage.Static buildId={buildId} />
    </div>
  );
};

export default Build;
