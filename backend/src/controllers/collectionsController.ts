import { Collection } from "../models";
import { Op } from "sequelize";
import { searchQueryBuilder } from "../utils";
import { errors } from "../client-error";
import { CollectionReq, Res } from "../../types";

const search = async function (req, res) {
  const { category, name, sort, uuid } = req.query;
  const searchQuery = searchQueryBuilder(req.query);

  // Category
  if (category) {
    searchQuery.where.categoryName = {
      [Op.startsWith]: category,
    };
  }

  // Name
  if (name) {
    searchQuery.where.name = {
      [Op.iLike]: "%" + name + "%",
    };
  }

  if (uuid) {
    searchQuery.where.creatorUuid = uuid;
  }

  // Sorting order
  if (sort === "new") {
    searchQuery.order = [["createdAt", "DESC"]];
  } else if (sort === "top") {
    searchQuery.order = [["totalFavorites", "DESC"]];
  }

  const collections = await Collection.findAll({
    ...searchQuery,
    include: ["builds", "creator", "images"],
  }).catch((ignored) => []);

  res.send(await Promise.all(collections.map((c) => c.toJSON())));
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
