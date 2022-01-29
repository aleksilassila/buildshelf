const { Category, User } = require("../models");
const { Op } = require("sequelize");
const { Build, Collection, Tag } = require("../models/index");
const { searchQueryBuilder, parseLitematic } = require("../utils");
const { errors } = require("../client-error");
const fs = require("fs");
const validateJSON = require("jsonschema").validate;
const crypto = require("crypto");

const litematicSchema = {
  type: "object",
  properties: {
    MinecraftDataVersion: { type: "number" },
    Version: { type: "number" },
    Metadata: {
      type: "object",
      properties: {
        EnclosingSize: {
          type: "object",
          properties: {
            x: {
              type: "number",
              minimum: 1,
            },
            y: {
              type: "number",
              minimum: 1,
            },
            z: {
              type: "number",
              minimum: 1,
            },
          },
          required: ["x", "y", "z"],
        },
      },
      required: ["EnclosingSize"],
    },
  },
  required: ["Metadata", "Version", "MinecraftDataVersion"],
};

exports.create = async function (req, res) {
  if (req.files?.buildFile === undefined) {
    errors.BAD_REQUEST.send(res);
    return;
  }

  const litematic = await parseLitematic(req.files?.buildFile[0].path);

  if (!validateJSON(litematic, litematicSchema).valid) {
    errors.BAD_REQUEST.send(res, "Error parsing litematic file.");
    return;
  }

  const buildFile = req.files?.buildFile[0];
  const { description, title, category, collectionId } = req.body;

  const tags =
    req.body.tags
      ?.split(",")
      .slice(0, 3)
      .map((i) => i.toLowerCase().substring(0, 255)) || [];

  const images = req.files?.images?.length
    ? req.files.images.map((i) => i.filename)
    : [];

  if (category) {
    if (!(await Category.findOne({ where: { name: category } }))) {
      errors.NOT_FOUND.send(res, "Category not found.");
      return;
    }
  }

  if (collectionId) {
    if (
      !(await Collection.findOne({
        where: { id: collectionId, userUuid: req.user.uuid },
      }))
    ) {
      errors.NOT_FOUND.send(res, "Collection not found.");
      return;
    }
  }

  // Calculate build file hash
  const hashSum = crypto.createHash("md5");
  hashSum.update(fs.readFileSync(buildFile.path));

  const build = await Build.create({
    title,
    description,
    images,
    creatorUuid: req.user.uuid,
    collectionId,
    category,
    buildFile: {
      filename: buildFile.filename,
      version: litematic.Version,
      minecraftDataVersion: litematic.MinecraftDataVersion,
      enclosingSize: {
        x: litematic.Metadata?.EnclosingSize?.x,
        y: litematic.Metadata?.EnclosingSize?.y,
        z: litematic.Metadata?.EnclosingSize?.z,
      },
      blockCount: litematic.Metadata?.TotalBlocks,
      md5: hashSum.digest("hex"),
    },
  });

  for (const name of tags) {
    const [instance] = await Tag.findOrCreate({
      where: { name },
      defaults: {
        name,
      },
    });
    await build.addTag(instance);
  }

  res.send(`${build.id}`);
};

// FIXME clean this
exports.search = async function (req, res) {
  const { tags, collection, category, title, sort, uuid, approved } = req.query;
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
    searchQuery.where.creatorUuid = uuid;
  }

  if (approved) {
    searchQuery.where.approved = approved;
  }

  // Sorting order
  if (sort === "new") {
    searchQuery.order = [["createdAt", "DESC"]];
  } else if (sort === "top") {
    searchQuery.order = [["totalSaves", "DESC"]];
  }

  const builds = await Build.findAll({
    ...searchQuery,
    include: [
      {
        model: Tag,
        where: tagsWhere,
      },
      {
        model: User,
        as: "creator",
      },
    ],
  });

  res.send(await Build.toJSONArray(builds, req.user));
};

exports.getFollowed = async function (req, res) {
  const user = req.user;
  const follows = (await user.getFollows()).map((u) => u.uuid);

  const builds = await Build.findAll({
    order: [["createdAt", "DESC"]],
    include: {
      model: User,
      as: "creator",
      where: {
        uuid: { [Op.in]: follows },
      },
    },
  });

  res.send(await Build.toJSONArray(builds, user));
};

exports.get = async function (req, res) {
  const { buildId } = req.params;

  const build = await Build.findOne({
    where: {
      id: buildId,
    },
    include: ["collection", "creator"],
  }).catch((err) => {});

  if (!build || !build.hasAccess(req.user)) {
    errors.NOT_FOUND.send(res, "Build not found");
    return;
  }

  res.send(await build.toJSON(req.user));
};

exports.save = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const shouldSave = req.body.save;

  const build = await Build.findOne({
    where: {
      id: buildId,
    },
  }).catch((err) => {});

  if (!build || !build.hasAccess(req.user)) {
    errors.NOT_FOUND.send(res, "Build not found");
    return;
  }

  const isSaved = await user.hasSavedBuild(build);

  if (shouldSave && !isSaved) {
    await user.addSavedBuild(build);
  } else if (!shouldSave && isSaved) {
    await user.removeSavedBuild(build);
  }

  // await build.save();

  await build.updateTotalSaves();

  res.status(200).send(shouldSave ? "Build saved" : "Build unsaved");
};

exports.download = function (req, res) {};

exports.bookmark = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const addBookmark = req.body.bookmark;

  const build = await Build.findOne({
    where: {
      id: buildId,
    },
  }).catch((err) => {});

  if (!build || !build.hasAccess(req.user)) {
    errors.NOT_FOUND.send(res);
    return;
  }

  const isSaved = await user.hasBookmark(build);

  if (addBookmark && !isSaved) {
    await user.addBookmark(build);
  } else if (!addBookmark && isSaved) {
    await user.removeBookmark(build);
  }

  res.send(addBookmark ? "Build bookmarked" : "Bookmark removed");
};

exports.update = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const build = Build.findOne({
    where: { id: buildId },
    include: ["collection", "creator"],
  }).catch(() => {});

  if (!build || !build.hasAccess(user)) {
    errors.NOT_FOUND.send(res, "Build not found.");
    return;
  }

  if (user.uuid !== build.creator.uuid) {
    errors.UNAUTHORIZED.send(res);
    return;
  }

  const { description, title, collectionId } = req.body;

  build.set({
    description: description || build.description,
    title: title || build.title,
    collectionId: collectionId || build.collectionId,
  });

  build.save().then(() => res.send("OK"));
};

exports.approve = async function (req, res) {
  const { buildId } = req.params;
  const approve = req.body.approve;

  const build = Build.findOne({
    where: {
      id: buildId,
    },
  }).catch(() => {});

  if (!build) {
    errors.NOT_FOUND.send(res);
    return;
  }

  build.approved = approve;
  build.save().then(() => res.send("OK"));
};
