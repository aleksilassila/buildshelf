import Navbar from "../../components/navbar/Navbar";
import * as BuildPage from "../../components/buildPage/BuildPage";
import { getSingleParams } from "../../utils/utils";

const Build = ({}) => {
  const { buildId } = getSingleParams();

  return (
    <div>
      <Navbar />
      <BuildPage.Static buildId={buildId} />
    </div>
  );
};

export default Build;
