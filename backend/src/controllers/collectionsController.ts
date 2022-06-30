import { Collection } from "../models";
import { Op } from "sequelize";
import { errors } from "../client-error";
import { CollectionReq, OptionalAuthReq, Res } from "../../types";
import { Request } from "express/ts4.0";

const search = async function (
  req: OptionalAuthReq<
    Request<
      {},
      {},
      {},
      {
        categoryName: string;
        name: string;
        sort: "top" | "new" | "popular";
        creatorUuid: string;
      }
    >
  >,
  res: Res
) {
  const { categoryName, sort } = req.query;

  await Collection.search(
    {
      where: {
        categoryName: {
          [Op.startsWith]: categoryName,
        },
      },
      order: {
        new: [["createdAt", "DESC"]],
        top: [["totalFavorites", "DESC"]],
      }[sort || "new"],
      include: ["builds", "creator", "images"],
    },
    req
  )
    .then(async (collections) =>
      res.send(await Promise.all(collections.map((c) => c.toJSON())))
    )
    .catch((err) => errors.SERVER_ERROR.send(res));
};

const getCollection = async function (req: CollectionReq, res: Res) {
  const { collection } = req;

  res.send(await collection.toJSON(req.user));
};

const create = async function (req, res) {
  const { name, description } = req.body;

  const collection = await Collection.create({
    name,
    description,
    creatorUuid: req.user.uuid,
  });

  res.send(`${collection.id}`);
};

const deleteCollection = async function (req, res) {
  const { collectionId } = req.params;

  const collection = await Collection.findOne({
    where: { id: collectionId, creatorUuid: req.user.uuid },
  }).catch((ignored) => {});

  if (collection) {
    await collection.destroy();
  } else {
    res.status(404).send("Collection not found.");
    return;
  }

  res.send("OK");
};

const favorite = async function (req: CollectionReq, res: Res) {
  const { user, collection } = req;
  const addFavorite = req.body.favorite;

  const inFavorites = await user.hasFavoriteCollection(collection);

  if (addFavorite && !inFavorites) {
    await user.addFavoriteCollection(collection);
  } else if (!addFavorite && inFavorites) {
    await user.removeFavoriteCollection(collection);
  }

  await collection.updateTotalFavorites();

  res.send(
    addFavorite
      ? "Collection added to favorites"
      : "Collection removed from favorites"
  );
};

const update = async function (req, res) {};

export { search, getCollection, create, deleteCollection, favorite, update };
