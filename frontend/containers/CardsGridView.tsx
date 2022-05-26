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
    <div className="builds-list">
      <BuildPage.Floating
        buildId={buildId}
        setBuildPage={setBuildId}
        modal={true}
      />
      {children}
      <div className="cards-container">
        {builds.map((build: Build, index) => {
          return (
            <div className="card" key={index}>
              <BuildCard build={build} openBuild={setBuildId} />
            </div>
          );
        })}
      </div>
      <style jsx>
        {`
          .builds-list {
          }

          .cards-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin: -0.5em;
            ${!!children ? "margin-top: 0;" : ""}
          }

          .card {
            flex: 1 1 auto;
            margin: 0.5em;
          }
        `}
      </style>
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
