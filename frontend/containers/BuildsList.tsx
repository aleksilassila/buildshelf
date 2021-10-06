import BuildCard from "../components/BuildCard";
import {Build} from "../interfaces/Builds";
import BuildPage from "../components/BuildPage";
import {useState} from "react";

const BuildsList = ({ builds }) => {
    const [buildId, setBuildId] = useState(undefined);

    return (
        <div className="builds-list">
            <BuildPage buildId={buildId} setBuildPage={setBuildId} modal={true} />
            <h3>Popular builds right now</h3>
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