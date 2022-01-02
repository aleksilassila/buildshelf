import BuildCard from "../components/builds/BuildCard";
import { Build } from "../interfaces/Builds";
import BuildPage from "../components/modals/BuildPage";
import { useState } from "react";
import theme from "../constants/theme";
import ArrowLeft from "../components/icons/ArrowLeft";
import ArrowRight from "../components/icons/ArrowRight";

interface Props {
  builds: Build[];
  children: JSX.Element | undefined;
}

const CardsRowView = ({ builds, children }: Props) => {
  const [buildId, setBuildId] = useState(undefined);
  const [scrollIndex, setScrollIndex] = useState(0);

  const onClickPrevious = (e) => {
    e.preventDefault();
    setScrollIndex(scrollIndex <= 1 ? builds.length - 1 : scrollIndex - 1);
  };

  const onClickNext = (e) => {
    e.preventDefault();
    setScrollIndex(scrollIndex + 1);
  };

  const getBuildList = function (builds: any[]) {
    const newList = [];
    let index = scrollIndex % builds.length;

    for (let i = 0; i < builds.length; i++) {
      newList.push(builds[index]);
      if (index + 1 >= builds.length) index = 0;
      else index += 1;
    }

    return newList;
  };

  return (
    <div className="cards-row-view">
      <BuildPage buildId={buildId} setBuildPage={setBuildId} modal={true} />
      <div className="heading-container">
        <div className="heading">{children}</div>
        <div className="heading-controls">
          <div onClick={onClickPrevious} style={{ marginRight: "0.5em" }}>
            <ArrowLeft />
          </div>
          <div onClick={onClickNext}>
            <ArrowRight />
          </div>
        </div>
      </div>
      <div className="cards-container">
        {getBuildList(builds).map((build: Build, index) => {
          return (
            <div className="card" key={index}>
              <BuildCard build={build} openBuild={setBuildId} />
            </div>
          );
        })}
      </div>
      <style jsx>
        {`
          .cards-row-view {
            padding: 2rem 5vw;
            position: relative;
          }

          .heading-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .cards-container {
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            height: calc(250px + 1em);
            margin: 0 -0.5em;
          }

          .card {
            flex: 1 1 auto;
            margin: 0.5em 0.5em;
          }

          .heading-controls {
            display: flex;
            opacity: 0;
          }

          .heading-controls > * {
            border-radius: 50%;
            text-align: center;
            width: 2.5em;
            line-height: 2.5em;
          }

          .heading-controls > *:hover {
            cursor: pointer;
            background-color: ${theme.lightHighContrast};
          }
          
          .cards-row-view:hover .heading-controls {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default CardsRowView;
