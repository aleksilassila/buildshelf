import BuildCard from "../components/builds/BuildCard";
import {Build} from "../interfaces/Builds";
import BuildPage from "../components/builds/BuildPage";
import {useState} from "react";
import theme from "../constants/theme";

interface Props {
    builds: Build[],
    heading: JSX.Element | undefined,
}

const CardsRowView = ({ builds, heading }: Props) => {
    const [buildId, setBuildId] = useState(undefined);
    const [scrollIndex, setScrollIndex] = useState(0);

    const onClickPrevious = (e) => {
        e.preventDefault();
        setScrollIndex(scrollIndex <= 1 ? builds.length - 1 : scrollIndex - 1);
    }

    const onClickNext = (e) => {
        e.preventDefault();
        setScrollIndex(scrollIndex + 1);
    }

    const getBuildList = function (builds: any[]) {
        const newList = [];
        let index = scrollIndex % builds.length;

        for (let i = 0; i < builds.length; i++) {
            newList.push(builds[index]);
            if (index + 1 >= builds.length) index = 0;
            else index += 1;
        }

        return newList;
    }

    return <div className="builds-list">
        <BuildPage buildId={buildId} setBuildPage={setBuildId} modal={true} />
        {heading}
        <div className="buttons-container">
            <div className="cards-container">
                {
                    getBuildList(builds).map((build: Build, index) => {
                        return <div className="card" key={index}><BuildCard build={build} openBuild={setBuildId} /></div>;
                    })
                }
            </div>
            <div className="back" onClick={onClickPrevious} />
            <div className="forward" onClick={onClickNext} />
        </div>
        <style jsx>
            {`
                .builds-list {
                    padding: 3vh 3vw;
                    position: relative;
                }
                
                .cards-container {
                    display: flex;
                    flex-wrap: wrap;
                    overflow: hidden;
                    height: calc(250px + 1em);
                    margin: 0 -0.5em;
                }
                
                .buttons-container {
                    position: relative;
                }
                
                .card {
                    flex: 1 1 auto;
                    margin: 0.5em 0.5em;
                }
                
                .back, .forward {
                    background-size: 1em;
                    background-repeat: no-repeat;
                    background-color: ${theme.highContrastLight};
                    height: 3em;
                    width: 3em;
                    border-radius: 1000px;
                    box-shadow: 0 0 10px 5px #00000022;
                    cursor: pointer;
                    position: absolute;
                    top: calc(50% - 1.5em);
                }
                
                .back:hover, .forward:hover {
                    background-color: #eeeeee;
                }
                
                .back {
                    left: -1.5em;
                    background-image: url("/angle-left.svg");
                    background-position: 45% center;

                }
                
                .forward {
                    right: -1.5em;
                    background-image: url("/angle-right.svg");
                    background-position: 55% center;

                }
            `}
        </style>
    </div>
}

export default CardsRowView;
