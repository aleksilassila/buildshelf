const { Collection } = require("../models");
const { Op } = require("sequelize");

exports.findCollections = async function (req, res) {
  const { searchQuery } = req.query;

  if (!searchQuery) {
    res.status(400).send("Search query required.");
    return;
  }

  res.send(
    await Collection.findAll({
      where: {
        ownerId: req.user.uuid,
        name: {
          [Op.startsWith]: searchQuery,
        },
      },
    })
  );
};

exports.getUserCollections = async function (req, res) {
  res.send(
    await Collection.findAll({
      where: {
        ownerId: req.user.uuid,
      },
    })
  );
};

exports.createCollection = async function (req, res) {
  const { name, description } = req.query;

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

  if (!collectionId) {
    res.status(400).send("Invalid collection id.");
    return;
  }

  const collection = await Collection.findOne({
    where: { id: collectionId },
  });

  if (collection?.ownerId === req.user.uuid) {
    await collection.destroy();
  } else {
    res.status(401).send("You do not have permission to do that.");
    return;
  }

  res.send("OK");
};
