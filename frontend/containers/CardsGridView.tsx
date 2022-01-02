import BuildCard from "../components/BuildCard";
import { Build } from "../interfaces/Builds";
import BuildPage from "../components/modals/BuildPage";
import { useState } from "react";

interface Props {
  builds: Build[];
  children?: JSX.Element;
}

// TODO: splash as a prop, if no splash then render content
const CardsGridView = ({ builds, children = null }: Props) => {
  const [buildId, setBuildId] = useState(undefined);

  return (
    <div className="builds-list">
      <BuildPage buildId={buildId} setBuildPage={setBuildId} modal={true} />
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

export default CardsGridView;
