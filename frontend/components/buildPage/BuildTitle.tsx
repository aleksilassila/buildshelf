import { Build } from "../../interfaces/ApiResponses";

const BuildTitle = ({ build }: { build: Build }) => (
  <div className="flex flex-row gap-4">
    <div
      className="h-14 w-14 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://crafatar.com/avatars/${build.creator?.uuid}')`,
      }}
    />
    <div className="flex flex-col justify-end">
      <div className="font-bold text-2xl">{build.title}</div>
      <div>
        Litematic by{" "}
        <a
          href={"/user/" + build.creator?.uuid}
          className="font-medium hover:underline"
        >
          {build.creator?.username}
        </a>
      </div>
    </div>
  </div>
);

export default BuildTitle;
