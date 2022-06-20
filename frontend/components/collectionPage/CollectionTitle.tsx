import {Collection} from "../../interfaces/ApiResponses";

const CollectionTitle = ({
  collection,
  className,
  ...rest
}: {
  collection: Collection;
  className?: string;
}) => (
  <div className={"flex flex-row gap-4 " + className} {...rest}>
    <div
      className="h-14 w-14 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://crafatar.com/avatars/${collection.creator?.uuid}')`,
      }}
    />
    <div className="flex flex-col justify-end">
      <div className="font-bold text-2xl">{collection.name}</div>
      <div>
        Collection by{" "}
        <a
          href={"/users/" + collection.creator?.uuid}
          className="font-medium hover:underline"
        >
          {collection.creator?.username}
        </a>
      </div>
    </div>
  </div>
);

export default CollectionTitle;
