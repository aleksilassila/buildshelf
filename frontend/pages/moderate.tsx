import TitleBar from "../components/bars/TitleBar";
import {useApiFeed} from "../utils/api";
import {Build} from "../interfaces/ApiResponses";
import InfinityScroll from "../containers/InfinityScroll";
import theme from "../constants/theme";
import BuildsTableView from "../containers/BuildsTableView";

const Moderate = () => {
  const [builds, loading, error, fetchMore, refetch] = useApiFeed<Build>(
    "/builds/search",
    {
      params: {
        approved: false,
        includePrivate: true,
      },
    }
  );

  return (
    <div className="moderate flex">
      <TitleBar />
      <div className="page-container flex">
        <div className="content flex">
          <InfinityScroll fetchMore={fetchMore}>
            <BuildsTableView
              loading={loading && builds?.length === 0}
              error={error}
              builds={builds}
            />
          </InfinityScroll>
        </div>
      </div>
      <style jsx>{`
        .moderate {
        }

        .content {
          // background-color: ${theme.lightLowContrast};
          padding: 0.5em;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Moderate;
