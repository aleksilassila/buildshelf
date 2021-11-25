import theme from "../../theme";
import {Build} from "../../interfaces/Builds";

interface Props {
    build: Build,
    openBuild: (number) => void,
}

const BuildCard = ({ build, openBuild }: Props) => {
    return <div className="container">
        <div className="card" onClick={() => openBuild(build.id)}>
            <div>
                <h3 className="title">{build.title}</h3>
                {/*<h3 className="category">{build.category?.name?.replace("/", " / ")}</h3>*/}
            </div>
            <div className="stats">
                {/*<h3 className="downloads"><div className="downloads-icon" />{build.downloads}</h3>*/}
                <h3 className="saves"><div className="saves-icon" />{build.totalFavorites}</h3>
            </div>
            {/*<h4 className="tags">{*/}
            {/*    // build.tags?.map((tag, index) => <h3 key={index} className="tag">{tag.name}</h3>)*/}
            {/*    build.tags?.map((tag, index) => tag.name).join(" ● ")*/}
            {/*}</h4>*/}
            <span className="description">
                <span>{build.description}</span>
            </span>
        </div>
        {/*<div className="info">*/}
        {/*    <span>By <span className="username">Username</span> in <span className="collection">Medieval village</span></span>*/}
        {/*    <span className="category">houses/medieval</span>*/}
        {/*</div>*/}
        <style jsx>
            {`
            .card {
                background-color: ${theme.lowContrastDark};
                background-image: url("${build?.images?.length ? process.env.BACKEND_ENDPOINT + "/files/" + build?.images[0] : "/blueprint.jpeg"}");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                padding: 1em;
                border-radius: 4px;
                min-width: 350px;
                min-height: 250px;
                width: auto;
                position: relative;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
            }
            
            .title, .downloads, .saves {
                display: inline-block;
                margin-bottom: 0.4em;
                padding: 0.2em 0.3em;
                background-color: ${theme.highContrastLight};
                border-radius: 4px;
            }
            
            .stats {
                justify-self: right;
            }
            
            .downloads {
                margin-right: 0.4em;
            }
            
            .stats > img {
                height: 1em;
                width: 1em;
            }
            
            .downloads-icon {
                background-image: url("/downloads.svg");
            }
            
            .saves-icon {
                background-image: url("/heart.svg");
            }
            
            .downloads-icon, .saves-icon {
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                height: 0.7em;
                width: 0.7em;
                display: inline-block;
                margin-right: 0.15em;
            }
            
            .description {
                color: ${theme.highContrastLight};
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
                border-bottom: 5px solid ${theme.highContrastDark};
            }
            
            .description:hover {
                opacity: 1;
            }
            
            .info {
                font-size: 1em;
                display: flex;
                height: 30px;
                align-items: center;
                justify-content: space-between;
                //font-weight: 600;
                color: #333333;
            }
            
            .username {
                font-weight: 600;
            }
            
            .username:hover {
                text-decoration: underline;
                cursor: pointer;
            }
        `}
        </style>
    </div>;
}

export default BuildCard;
