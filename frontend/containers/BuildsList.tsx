import BuildCard from "../components/builds/BuildCard";
import {Build} from "../interfaces/Builds";
import BuildPage from "../components/builds/BuildPage";
import {useState} from "react";

interface Props {
    builds: Build[],
    heading: JSX.Element | undefined,
}

const BuildsList = ({ builds, heading }: Props) => {
    const [buildId, setBuildId] = useState(undefined);

    return (
        <div className="builds-list">
            <BuildPage buildId={buildId} setBuildPage={setBuildId} modal={true} />
            {heading}
            <div className="cards-container">
                {
                    builds.map((build: Build, index) => {
                        return <BuildCard key={index} build={build} openBuild={setBuildId} />;
                    })
                }
            </div>
            <style jsx>
                {`
                    .builds-list {
                        padding: 3vh 3vw;
                    }
                    
                    .cards-container {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        margin: 0 -1em;
                    }
                `}
            </style>
        </div>
    );
}

export default BuildsList;
