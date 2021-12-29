import theme from "../../constants/theme";
import { Build } from "../../interfaces/Builds";

interface Props {
  build: Build;
  openBuild: (number) => void;
}

const ProfilePicture = ({ uuid }) => (
  <div>
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
);

const BuildCard = ({ build, openBuild }: Props) => {
  return (
    <div className="container">
      <div className="card" onClick={() => openBuild(build.id)}>
        <div>
          <h3 className="title">{build.title}</h3>
        </div>
        <div>
          <h3 className="details">
            {[build.category?.name]
              .concat(build?.tags?.map((tag) => "#" + tag.name))
              .join(", ")}
          </h3>
        </div>
        <a
          href={"/user/" + build.creator.uuid}
          className="creator-container"
          onClick={(e) => e.stopPropagation()}
        >
          {" "}
          {/*Fixme: Do the same for the top that is done for bottom rn*/}
          <ProfilePicture uuid={build.creator.uuid} />
          <span className="creator">{build.creator.username}</span>
        </a>
        <span className="favorites">Favorites: {build.totalFavorites}</span>
        <div className="description-container">
          <span className="description">
            {build.description.length > 200
              ? build.description.substring(0, 200) + "..."
              : build.description}
          </span>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            background-image: url("${build?.images?.length
              ? process.env.BACKEND_ENDPOINT + "/files/" + build?.images[0]
              : "/blueprint.jpeg"}");
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
            box-shadow: ${theme.shadow};
            background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0) 70%,
              rgba(0, 0, 0, 0.4) 90%
            );
          }

          .card:hover {
            background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.4) 0%,
              rgba(0, 0, 0, 0.4) 100%
            );
          }

          .card > *:nth-child(2) {
            justify-self: right;
          }

          .title, .creator {
            font-weight: 600;
            color: ${theme.lightHighContrast};
          }

          .details, .favorites {
            font-weight: 500;
            color: ${theme.lightLowContrast};
          }

          .description {
            font-weight: 500;
            color: ${theme.lightLowContrast};
          }
          
          .description-container {
            display: flex;
            align-items: center;
            position: absolute;
            justify-content: center;
            top: 3.5rem;
            left: 1.5rem;
            right: 1.5rem;
            bottom: 3.5rem;
            opacity: 0;
          }
          
          .creator-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            align-self: flex-end;
            opacity: 0;
          }

          .favorites {
            opacity: 0;
            justify-self: flex-end;
            align-self: flex-end;
          }

          .card:hover .favorites,
          .card:hover .creator-container,
          .card:hover .description-container {
            opacity: 1;
          }

          a {
            text-decoration: none;
          }
        `}
      </style>
    </div>
  );
};

export default BuildCard;
