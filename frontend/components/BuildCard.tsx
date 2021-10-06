import theme from "../theme";
import {Build} from "../interfaces/Builds";

interface Props {
    build: Build,
    openBuild: (number) => void,
}

const BuildCard = ({ build, openBuild }: Props) => {
    return <div className="card" onClick={() => openBuild(build.id)}>
        <h3 className="title">{build.title}</h3>
        <span className="description">
            <span>{build.description}</span>
        </span>
        <style jsx>
            {`
            .card {
                background-color: ${theme.lowContrastDark};
                background-image: url("${build.images[0] ? process.env.BACKEND_ENDPOINT + "/files/" + build.images[0] : "/blueprint.jpeg"}");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                padding: 1em;
                margin: 0.7em 1em;
                border-radius: 4px;
                min-width: 350px;
                min-height: 250px;
                width: auto;
                flex-grow: 1;
                position: relative;
            }
            
            .title {
                display: inline;
                margin-bottom: 0.4em;
                padding: 0.2em;
                background-color: ${theme.lowContrastDark};
                border-radius: 4px;
            }
            
            .description {
                position: absolute;
                padding: 1.2em;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 0.15s linear;
                backdrop-filter: blur(3px);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background-color: ${theme.lowContrastDark}80;
                cursor: pointer;
                border-bottom: 3px solid ${theme.lowContrastLight};
            }
            
            .description:hover {
                opacity: 1;
            }
        `}
        </style>
    </div>;
}

export default BuildCard;
