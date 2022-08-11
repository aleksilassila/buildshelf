import { Build } from "../../interfaces/ApiResponses";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  build: Build;
}

const BuildTitle = ({ build, className, ...rest }: Props) => (
  <div {...rest} className={`flex flex-row gap-4 flex-shrink-0 ${className}`}>
    <div
      className="h-14 w-14 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://crafatar.com/avatars/${build.creator?.uuid}')`,
      }}
    />
    <div className="flex flex-col justify-end">
      <div className="font-bold text-2xl">{build.name}</div>
      <div>
        Litematic by{" "}
        <a
          href={"/users/" + build.creator?.uuid}
          className="font-medium hover:underline"
        >
          {build.creator?.username}
        </a>
      </div>
    </div>
  </div>
);

export default BuildTitle;
