const { Collection, Build } = require("../models/index");
const { Op } = require("sequelize");
const { searchQueryBuilder } = require("../utils");

exports.getCollections = async function (req, res) {
  const { category, name, sort, uuid } = req.query;
  const searchQuery = searchQueryBuilder(req.query);

  // Category
  if (category) {
    searchQuery.where.categoryName = {
      [Op.startsWith]: category,
    };
  }

  // Title
  if (name) {
    searchQuery.where.name = {
      [Op.iLike]: "%" + name + "%",
    };
  }

  if (uuid) {
    searchQuery.where.ownerId = uuid;
  }

  // Sorting order
  if (sort === "new") {
    searchQuery.order = [["createdAt", "DESC"]];
  } else if (sort === "top") {
    searchQuery.order = [["_totalFavorites", "DESC"]];
  }

  const collections = await Collection.findAll({
    ...searchQuery,
    include: [Build],
  }).catch(err => []);

  res.send(await Promise.all(collections.map(c => c.toJSON())));
};

exports.createCollection = async function (req, res) {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400).send("Name and description required.");
    return;
  }

  const collection = await Collection.create({
    name,
    description,
    ownerId: req.user.uuid,
  });

  res.send(`${collection.id}`);
};

exports.deleteCollection = async function (req, res) {
  const { collectionId } = req.params;

  const collection = await Collection.findOne({
    where: { id: collectionId, ownerId: req.user.uuid },
  }).catch(err => {});

  if (collection) {
    await collection.destroy();
  } else {
    res.status(404).send("Collection not found.");
    return;
  }

  res.send("OK");
};

exports.favorite = async function (req, res) {
  const user = req.user;
  const { collectionId } = req.params;
  const addFavorite = req.body.favorite;

  const collection = await Collection.findOne({
    where: {
      id: collectionId,
    },
  }).catch((err) => {});

  if (!collection) {
    res.status(404).send("Collection not found");
    return;
  }

  const inFavorites = await user.hasFavoriteCollection(collection);

  if (addFavorite && !inFavorites) {
    await user.addFavoriteCollection(collection);
  } else if (!addFavorite && inFavorites) {
    await user.removeFavoriteCollection(collection);
  }

  await collection.updateTotalFavorites();

  res
    .status(200)
    .send(
      addFavorite
        ? "Collection added to favorites"
        : "Collection removed from favorites"
    );
};

exports.modify = async function (req, res) {};
