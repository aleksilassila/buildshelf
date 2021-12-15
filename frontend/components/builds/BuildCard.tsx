import theme from "../../constants/theme";
import {Build} from "../../interfaces/Builds";

interface Props {
    build: Build,
    openBuild: (number) => void,
}

const ProfilePicture = ({ uuid }) => <div>
    <style jsx>{`
      div {
        background: url("https://crafatar.com/avatars/${uuid}");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 1.5em;
        height: 1.5em;
        display: inline-block;
        margin-right: 0.5em;
      }
    `}</style>
</div>


const BuildCard = ({ build, openBuild }: Props) => {
    return <div className="container">
        <div className="card" onClick={() => openBuild(build.id)}>
            <div>
                <h3 className="title">{build.title}</h3>
            </div>
            <div className="stats">
                <h3 className="favorites"><div className="favorites-icon" />{build.totalFavorites}</h3>
            </div>
            <a href={"/user/" + build.creator.uuid} className="creator-container" onClick={e => e.stopPropagation()}>
                <ProfilePicture uuid={build.creator.uuid} />
                <span className="creator">{build.creator.username}</span>
            </a>
            <span className="info">houses, #medieval</span>
        </div>
        <style jsx>
            {`
            .container {
                background-image: url("${build?.images?.length ? process.env.BACKEND_ENDPOINT + "/files/" + build?.images[0] : "/blueprint.jpeg"}");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                border-radius: 4px;
            }
            
            .card {
                padding: 1em;
                border-radius: 4px;
                min-width: 350px;
                min-height: 250px;
                width: auto;
                position: relative;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                transition: background;
                cursor: pointer;
            }
            
            .card:hover {
              background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 90%);
            }
            
            .title, .downloads, .favorites {
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
            
            .favorites {
              border: 2px solid #ffffff00;
            }
            
            .favorites:hover {
              //background-color: ${theme.highContrastLight};
              border: 2px solid #666;
            }
            
            .stats > img {
                height: 1em;
                width: 1em;
            }
            
            .downloads-icon {
                background-image: url("/downloads.svg");
            }
            
            .favorites-icon {
                background-image: url("/heart.svg");
            }
            
            .downloads-icon, .favorites-icon {
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                height: 0.7em;
                width: 0.7em;
                display: inline-block;
                margin-right: 0.15em;
            }
            
            .info, .creator {
              font-weight: 600;
              color: ${theme.highContrastLight}
            }
            
            .creator-container {
              display: flex;
              flex-direction: row;
              align-items: center;
              align-self: flex-end;
              opacity: 0;

            }
            
            .info {
              opacity: 0;
              justify-self: flex-end;
              align-self: flex-end;
            }
            
            .card:hover .info, .card:hover .creator-container {
              opacity: 1;
            }
        `}
        </style>
    </div>;
}

export default BuildCard;
