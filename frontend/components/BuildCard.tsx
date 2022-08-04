import { Build } from "../interfaces/ApiResponses";
import Heart from "./icons/Heart";
import Styled from "./Styled";

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
  const opacity = "md:opacity-0 group-hover:opacity-100";

  const CardForeground = Styled(
    "card group p-4 rounded-xl w-auto grid grid-cols-2 grid-rows-2 cursor-pointer relative h-full"
  );

  const CardDescription = () => (
    <div
      className={`flex items-center absolute top-6 left-4 right-4 bottom-6 ${opacity}`}
    >
      <span className="text-stone-200 font-medium">
        {build.description.length > 200
          ? build.description.substring(0, 200) + "..."
          : build.description}
      </span>
    </div>
  );

  const CardHeading = () => (
    <h3 className="text-white font-semibold">{build.name}</h3>
  );
  const CardGrouping = () => (
    <h3 className="font-semibold text-stone-200 justify-self-end">
      {[build.categoryName]
        .concat(build?.tags?.map((tag) => "#" + tag.name))
        .join(", ")}
    </h3>
  );

  const CardCreator = () => (
    <a
      href={"/users/" + build.creator?.uuid}
      className={`flex gap-2 self-end ${opacity}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          backgroundImage:
            "url('https://crafatar.com/avatars/" + build.creator?.uuid + "')",
        }}
        className="bg-contain bg-center w-6 h-6"
      />
      <span className="font-semibold text-white">
        {build.creator?.username}
      </span>
    </a>
  );

  const CardSaves = () => (
    <span
      className={`self-end justify-self-end font-semibold ${
        build.isSaved ? "text-green-400" : "text-stone-200"
      } ${opacity}`}
    >
      <Heart /> {build.totalSaves}
    </span>
  );

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
      <CardForeground onClick={() => openBuild(build.id)}>
        <CardHeading />
        <CardGrouping />
        <CardCreator />
        <CardSaves />

        <CardDescription />
      </CardForeground>
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
