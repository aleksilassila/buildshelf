const { Collection } = require("../models");
const { Op } = require("sequelize");
const { searchQueryBuilder } = require("../utils");

exports.getCollections = async function (req, res) {
  const { name, uuid } = req.query;

  if (!name) {
    res.status(400).send("Search query required.");
    return;
  }

  res.send(
    await Collection.findAll({
      where: {
        ownerId: req.user.uuid,
        name: {
          [Op.iLike]: "%" + name + "%",
          ownerId: uuid,
        },
      },
      limit: 20,
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

  if (!collectionId) {
    res.status(400).send("Invalid collection id.");
    return;
  }

  const collection = await Collection.findOne({
    where: { id: collectionId, ownerId: req.user.uuid },
  });

  if (collection) {
    await collection.destroy();
  } else {
    res.status(404).send("Collection not found.");
    return;
  }

  res.send("OK");
};
