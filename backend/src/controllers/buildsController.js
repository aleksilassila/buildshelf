const { Category, User } = require("../models");
const { Op } = require("sequelize");
const { Build, Collection, Tag } = require("../models/index");
const { searchQueryBuilder } = require("../utils");

exports.create = async function (req, res) {
  if (req.files?.buildFile === undefined) {
    res.status(400).send("No build file attached.");
    return;
  }

  const buildFile = req.files?.buildFile[0];
  const {
    description,
    title,
    category: categoryString,
    collectionId,
  } = req.body;
  const tags =
    req.body.tags
      ?.split(",")
      .slice(0, 3)
      .map((i) => i.toLowerCase()) || [];

  if (!buildFile || !title) {
    res.status(400).send("Bad request");
    return;
  }

  const images = [];

  for (const image of req.files?.images || []) {
    images.push(image.filename);
  }

  const collection = collectionId
    ? await Collection.findOne({
        where: {
          id: collectionId,
          ownerId: req.user.uuid,
        },
      })
    : null;

  // const [collection] = collectionName ?
  //     await Collection.getOrCreateCollection(collectionName, collectionDescription, req.user.id) :
  //     [null];

  const [category] = categoryString
    ? await Category.getOrCreateCategory(categoryString)
    : [null];

  const values = {
    title,
    description,
    buildFile: buildFile.filename,
    images,
    creatorId: req.user.uuid,
    tags,
    collectionId: collection?.id,
    categoryName: category?.name,
  };

  const build = await Build.create(values);

  for (const tagName of tags) {
    const [tag] = await Tag.findOrCreate({
      where: {
        name: tagName,
      },
      defaults: {
        name: tagName,
      },
    });

    build.addTag(tag);
  }

  res.send(`${build.id}`);
};

exports.getBuilds = async function (req, res) {
  const { tags, collection, category, title, sort, uuid } = req.query;
  const searchQuery = searchQueryBuilder(req.query);

  let tagsWhere = undefined;

  // Tags
  if (tags) {
    tagsWhere = {
      name: {
        [Op.in]: tags.split(",").map((i) => i.toLowerCase()),
      },
    };
  }

  // Collection
  if (collection) {
    searchQuery.where.collectionId = parseInt(collection);
  }

  // Category
  if (category) {
    searchQuery.where.categoryName = {
      [Op.startsWith]: category,
    };
  }

  // Title
  if (title) {
    searchQuery.where.title = {
      [Op.iLike]: "%" + title + "%",
    };
  }

  if (uuid) {
    searchQuery.where.creatorId = uuid;
  }

  // Sorting order
  if (sort === "new") {
    searchQuery.order = [["createdAt", "DESC"]];
  } else if (sort === "top") {
    searchQuery.order = [["_totalFavorites", "DESC"]];
  }

  const builds = await Build.findAll({
    ...searchQuery,
    include: [
      {
        model: Tag,
        where: tagsWhere,
      },
    ],
  });

  res.send(await Promise.all(builds.map((build) => build.toJSON(req.user))));
};

exports.getFollowedBuilds = async function (req, res) {
  const user = req.user;

  let builds = [];

  (
    await user.getFollowings({
      attributes: [],
      include: ["builds"],
    })
  ).map((user) => (builds = builds.concat(user.builds)));

  builds = builds.sort(function(b1, b2) {
    return (b1.uploadedAt < b2.uploadedAt) ? -1 : ((b1.uploadedAt > b2.uploadedAt) ? 1 : 0);
});

  res.send(await Promise.all(builds.map((build) => build.toJSON(req.user))));
};

exports.getBuild = async function (req, res) {
  const { buildId } = req.params;

  if (isNaN(parseFloat(buildId))) {
    res.status(400).send("Bad request");
    return;
  }

  const build = await Build.findOne({
    where: {
      id: buildId,
    },
  });

  if (!build) {
    res.status(404).send("Build not found");
    return;
  }
  res.send(await build.toJSON(req.user));
};

exports.favorite = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const addFavorite = req.body.favorite;

  if (buildId === null || isNaN(parseInt(buildId))) {
    res.status(400).send("Bad request");
    return;
  }

  const build = await Build.findOne({
    where: {
      id: buildId,
    },
  });

  if (!build) {
    res.status(404).send("Build not found");
    return;
  }

  const inFavorites = await user.hasFavorite(build);

  if (addFavorite && !inFavorites) {
    await user.addFavorite(build);
  } else if (!addFavorite && inFavorites) {
    await user.removeFavorite(build);
  }

  // await build.save();

  await build.updateTotalFavorites();

  res
    .status(200)
    .send(
      addFavorite ? "Build added to favorites" : "Build removed from favorites"
    );
};

exports.download = function (req, res) {};

exports.search = function (req, res) {};

exports.save = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const addSave = req.body.save;

  if (buildId === null || isNaN(parseInt(buildId))) {
    res.status(400).send("Bad request");
    return;
  }

  const build = await Build.findOne({
    where: {
      id: buildId,
    },
  });

  const isSaved = await user.hasSave(build);

  if (addSave && !isSaved) {
    await user.addSave(build);
  } else if (!addSave && isSaved) {
    await user.removeSave(build);
  }

  res.send(addSave ? "Build saved" : "Build unsaved");
};
