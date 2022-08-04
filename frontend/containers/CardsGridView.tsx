import BuildCard from "../components/BuildCard";
import { Build } from "../interfaces/ApiResponses";
import * as BuildPage from "../components/BuildPage";
import { useState } from "react";
import NetworkError from "../components/statuses/NetworkError";
import Empty from "../components/statuses/Empty";
import Loading from "../components/statuses/Loading";

interface Props {
  children?: JSX.Element;
  builds: Build[];
  loading: boolean;
  error: Error | null;
}

const CardsGridView = ({ builds, loading, error, children = null }: Props) => {
  const [buildId, setBuildId] = useState(undefined);

  if (loading && !builds?.length) {
    return <Loading />;
  } else if (error) {
    return <NetworkError />;
  } else if (builds?.length === 0) {
    return <Empty />;
  }

  return (
    <div>
      <BuildPage.Floating buildId={buildId} setBuildPage={setBuildId} />
      {children}
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 2xl:grid-cols-3">
        {builds.map((build: Build, key) => {
          return (
            <div className="h-64" key={key}>
              <BuildCard build={build} openBuild={setBuildId} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Container = ({ children }) => {
  return (
    <div className="container">
      {children}
      <style jsx>
        {`
          .container {
            display: flex;
            flex: 1 0 auto;
          }

          .container > :global(*) {
            flex: 1 0 auto;
          }
        `}
      </style>
    </div>
  );
};

export default CardsGridView;
