import { Collection } from "../interfaces/ApiResponses";
import theme from "../constants/theme";
import Heart from "./icons/Heart";
import Link from "next/link";
import { useState } from "react";
import Button from "./ui/Button";
import * as Slides from "./containers/Slides";

interface Props {
  collection: Collection;
}

const CollectionCard = ({ collection }: Props) => {
  /*
  Picture
  name
  creator
  description
  category
  build count
  favorite count
  created at?
   */

  if (!collection) {
    return null;
  }

  return (
    <div className="rounded-xl flex justify-between overflow-hidden h-48 shadow-sm">
      <Slides.Container cols={1} className="w-1/3 max-w-md">
        {(collection.images || collection.builds[0]?.images).map((i) => (
          <Slides.Picture uri={i.filename} />
        ))}
      </Slides.Container>
      <div className="flex flex-col p-4 flex-1 border border-stone-200 bg-white rounded-br-xl rounded-tr-xl">
        <div className="flex justify-between">
          <Link href={"/collection/" + collection.id}>
            <h3 className="font-semibold text-lg cursor-pointer hover:underline">
              {collection.name}
            </h3>
          </Link>
          <span className="font-medium text-sm text-stone-700">
            {collection.builds.length} builds
          </span>
        </div>
        <div className="flex flex-col justify-between flex-1 gap-2 text-stone-700">
          <p className="">{collection.description}</p>
          <div className="flex justify-between text-sm font-medium">
            <div>
              By{" "}
              <Link href={"/user/" + collection.creator?.uuid}>
                <span
                  className={"font-semibold cursor-pointer hover:underline"}
                >
                  {collection.creator?.username}
                </span>
              </Link>
            </div>
            <div>
              <Heart /> {collection.totalFavorites}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
