import BuildCard from "../components/builds/BuildCard";
import {Build} from "../interfaces/Builds";
import BuildPage from "../components/builds/BuildPage";
import {useState} from "react";

interface Props {
    builds: Build[],
    heading?: JSX.Element,
}

const BuildsList = ({ builds, heading = null }: Props) => {
    const [buildId, setBuildId] = useState(undefined);

    return <div className="builds-list">
        <BuildPage buildId={buildId} setBuildPage={setBuildId} modal={true} />
        {heading}
        <div className="cards-container">
            {
                builds.map((build: Build, index) => {
                    return <div className="card" key={index}><BuildCard build={build} openBuild={setBuildId} /></div>;
                })
            }
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
                }
                
                .card {
                    flex: 1 1 auto;
                    margin: 0.5em;
                }
            `}
        </style>
    </div>
}

export default BuildsList;
