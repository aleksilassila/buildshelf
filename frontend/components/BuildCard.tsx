import theme from "../constants/theme";
import { Build } from "../interfaces/ApiResponses";
import Heart from "./icons/Heart";

interface Props {
  build: Build;
  openBuild: (number) => void;
  className?: string;
  rest?: any;
}

const BuildCard: ({
  build,
  openBuild,
  className,
  ...rest
}: {
  build: Build;
  openBuild: (number) => void;
  className?: string;
  [p: string]: any;
}) => JSX.Element = ({ build, openBuild, className, ...rest }) => {
  return (
    <div
      style={{
        backgroundImage: `url('${
          build?.images?.length
            ? process.env.BACKEND_ENDPOINT +
              "/files/" +
              build?.images[0].filename
            : "/blueprint.jpeg"
        }')`,
      }}
      className={"bg-center bg-cover rounded-xl h-full " + className}
    >
      <div
        className="card p-4 rounded-xl w-auto grid grid-cols-2 grid-rows-2 cursor-pointer relative h-full"
        onClick={() => openBuild(build.id)}
      >
        <div>
          <h3 className="text-white font-semibold">{build.title}</h3>
        </div>
        <div>
          <h3 className="details">
            {[build.category?.name]
              .concat(build?.tags?.map((tag) => "#" + tag.name))
              .join(", ")}
          </h3>
        </div>
        <a
          href={"/user/" + build.creator?.uuid}
          className="flex gap-2 self-end"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundImage:
                "url('https://crafatar.com/avatars/" +
                build.creator?.uuid +
                "')",
            }}
            className="bg-contain bg-center w-6 h-6"
          />
          <span className="creator">{build.creator?.username}</span>
        </a>
        <span className="favorites">
          <Heart /> {build.totalSaves}
        </span>
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
              ? process.env.BACKEND_ENDPOINT +
                "/files/" +
                build?.images[0].filename
              : "/blueprint.jpeg"}");
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 4px;
          }

          .card {
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

          .title,
          .creator {
            font-weight: 600;
            color: ${theme.lightHighContrast};
          }

          .details,
          .description {
            font-weight: 500;
            color: ${theme.lightLowContrast};
          }

          .favorites {
            font-weight: 600;
            color: ${build.isSaved ? theme.layout : theme.lightLowContrast};
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
