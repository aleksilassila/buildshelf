import { useRouter } from "next/router";
import TitleBar from "../../components/bars/TitleBar";
import * as BuildPage from "../../components/BuildPage";
import { getSingleParams } from "../../utils/utils";

const Build = ({}) => {
  const { buildId } = getSingleParams();

  return (
    <div>
      <TitleBar />
      <BuildPage.Static buildId={buildId} />
    </div>
  );
};

export default Build;
