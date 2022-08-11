import Navbar from "../../components/navbar/Navbar";
import * as BuildPage from "../../components/buildPage/BuildPage";
import { getSingleParams } from "../../utils/utils";
import { StaticBuildInfo } from "../../components/buildPage/BuildPage";

const Build = ({}) => {
  const { buildId } = getSingleParams();

  return (
    <div>
      <Navbar />
      <StaticBuildInfo buildId={buildId} />
    </div>
  );
};

export default Build;
