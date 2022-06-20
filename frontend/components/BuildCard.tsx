import {Build} from "../interfaces/ApiResponses";
import Heart from "./icons/Heart";

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
        className="card group p-4 rounded-xl w-auto grid grid-cols-2 grid-rows-2 cursor-pointer relative h-full"
        onClick={() => openBuild(build.id)}
      >
        <h3 className="text-white font-semibold">{build.title}</h3>
        <h3 className="font-semibold text-stone-200 justify-self-end">
          {[build.category?.name]
            .concat(build?.tags?.map((tag) => "#" + tag.name))
            .join(", ")}
        </h3>
        <a
          href={"/users/" + build.creator?.uuid}
          className="flex gap-2 self-end opacity-0 group-hover:opacity-100"
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
          <span className="font-semibold text-white">
            {build.creator?.username}
          </span>
        </a>
        <span
          className={`opacity-0 self-end justify-self-end group-hover:opacity-100 font-semibold ${
            build.isSaved ? "text-green-400" : "text-stone-200"
          }`}
        >
          <Heart /> {build.totalSaves}
        </span>
        <div className="flex items-center absolute top-6 left-4 right-4 bottom-6 opacity-0 group-hover:opacity-100">
          <span className="text-stone-200 font-medium">
            {build.description.length > 200
              ? build.description.substring(0, 200) + "..."
              : build.description}
          </span>
        </div>
      </div>
      <style jsx>
        {`
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
        `}
      </style>
    </div>
  );
};

export default BuildCard;
