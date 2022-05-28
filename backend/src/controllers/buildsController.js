const { Op } = require("sequelize");
const {
  Build,
  Collection,
  Tag,
  User,
  Category,
  Image,
  BuildFile,
} = require("../models/index");
const {
  searchQueryBuilder,
  parseSimplifiedLitematic,
  parseLitematic,
  writeLitematic,
} = require("../utils");
const { errors } = require("../client-error");
const fs = require("fs");
const validateJSON = require("jsonschema").validate;
const crypto = require("crypto");

const hasAccess = (res, build, user, message = "Build not found.") => {
  if (!build || !build.hasAccess(user)) {
    errors.NOT_FOUND.send(res, message);
    return false;
  }

  return true;
};

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
  const { description, title, category, collectionId, imageIds } = req.body;
  const file = req.file;

  if (file === undefined) {
    errors.BAD_REQUEST.send(res);
    return;
  }

  // Validate litematic file
  const simpleLitematic = await parseSimplifiedLitematic(file?.path);

  if (!validateJSON(simpleLitematic, litematicSchema).valid) {
    errors.BAD_REQUEST.send(res, "Error parsing litematic file.");
    return;
  }

  const tags =
    req.body.tags?.map((i) => i.toLowerCase().substring(0, 255)) || [];

  if (category) {
    if (!(await Category.findByPk(category))) {
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

  const buildFile = await BuildFile.create({
    filename: file.filename,
    version: simpleLitematic.Version,
    minecraftDataVersion: simpleLitematic.MinecraftDataVersion,
    x: simpleLitematic.Metadata?.EnclosingSize?.x,
    y: simpleLitematic.Metadata?.EnclosingSize?.y,
    z: simpleLitematic.Metadata?.EnclosingSize?.z,
    blockCount: simpleLitematic.Metadata?.TotalBlocks,
    md5: "",
  });

  const build = await Build.create({
    title,
    description,
    creatorUuid: req.user.uuid,
    collectionId,
    category,
    buildFileId: buildFile.id,
  });

  if (imageIds) {
    await build.setImagesById(imageIds);
  }

  // Add file id to the build file
  const { parsed: litematicWithId } = await parseLitematic(
    "uploads/" + buildFile.filename
  );

  if (litematicWithId?.value?.Metadata?.value) {
    litematicWithId.value.Metadata.value.Id = {
      type: "int",
      value: build.id,
    };
  }

  await writeLitematic("uploads/" + buildFile.filename, litematicWithId).then(
    async () => {
      // Calculate build file hash
      const hashSum = crypto.createHash("md5");
      hashSum.update(fs.readFileSync("uploads/" + buildFile.filename));

      // Update md5 hash
      await build.update({
        buildFile: {
          ...build.buildFile,
          md5: hashSum.digest("hex"),
        },
      });
    }
  );

  // Add tags
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

  try {
    await req.user.purgeImages();
  } catch (ignored) {
    console.log(ignored);
  }
};

// FIXME clean this
exports.search = async function (req, res) {
  const {
    tags,
    collection,
    category,
    title,
    sort,
    uuid,
    approved,
    includePrivate,
  } = req.query;
  const searchQuery = searchQueryBuilder(req.query);

  // Sorting order
  const where = {
    collectionId: parseInt(collection) || undefined,
    categoryName: category ? { [Op.startsWith]: category } : undefined,
    title: title
      ? {
          [Op.iLike]: "%" + title + "%",
        }
      : undefined,
    creatorUuid: uuid,
    approved,
    ...(!(req.user?.moderator && includePrivate) && { private: false }),
  };

  Build.findAll({
    ...searchQuery,
    where: Object.fromEntries(
      Object.entries(where).filter(([k, v]) => v !== undefined)
    ),
    ...(sort === "new" && { order: [["createdAt", "DESC"]] }),
    ...(sort === "top" && { order: [["totalSaves", "DESC"]] }),
    include: [
      {
        model: Tag,
        ...(tags && {
          where: {
            name: {
              [Op.in]: tags.split(",").map((i) => i.toLowerCase()),
            },
          },
        }),
      },
      {
        model: User,
        as: "creator",
      },
      { model: Image, as: "images" },
    ],
  })
    .then(async (builds) => {
      res.send(await Build.toJSONArray(builds, req.user));
    })
    .catch((err) => errors.SERVER_ERROR.send(res));
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

exports.downloadBuild = async function (req, res) {
  const { buildId } = req.params;
  const build = await Build.findByPk(parseInt(buildId)).catch(() => undefined);

  if (!build) {
    errors.NOT_FOUND.send(res, "Build not found.");
    return;
  }

  if (!build.approved) {
    errors.NOT_FOUND.send(res, "Build not found.");
    return;
  }

  if (build.private && (await build.getCreator()).uuid !== req.user?.uuid) {
    errors.NOT_FOUND.send(res, "Build not found.");
    return;
  }

  res.download(
    "./uploads/" + build.buildFile.filename,
    build.buildFile.filename
  );
};

exports.get = async function (req, res) {
  const { buildId } = req.params;

  const build = await Build.findByPk(buildId, {
    include: ["collection", "creator", "images"],
  }).catch((err) => {});

  if (!hasAccess(res, build, req.user)) {
    return;
  }

  res.send(await build.toJSON(req.user));
};

exports.save = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const shouldSave = req.body.save;

  const build = await Build.findByPk(buildId).catch((err) => {});

  if (!hasAccess(res, build, req.user)) {
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

exports.bookmark = async function (req, res) {
  const user = req.user;
  const { buildId } = req.params;
  const addBookmark = req.body.bookmark;

  const build = await Build.findByPk(buildId).catch((err) => {});

  if (!hasAccess(res, build, req.user)) {
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
  const { description, title, collectionId, imageIds, private } = req.body;
  const { buildId } = req.params;

  const build = await Build.findByPk(buildId, {
    include: ["collection", "creator"],
  }).catch(() => {});

  if (!hasAccess(res, build, user)) {
    return;
  }

  if (user.uuid !== build.creator.uuid) {
    errors.UNAUTHORIZED.send(res);
    return;
  }

  await build
    .update({
      description: description || build.description,
      title: title || build.title,
      collectionId: collectionId || build.collectionId,
      private: private !== undefined ? private : build.private,
    })
    .then(async () => {
      if (imageIds) {
        await build.setImagesById(imageIds);
      }
    })
    .then(() => res.send("OK"));
};

exports.approve = async function (req, res) {
  const { buildId } = req.params;
  const approve = req.body.approve;

  const build = Build.findByPk(buildId).catch(() => {});

  if (!build) {
    errors.NOT_FOUND.send(res);
    return;
  }

  build.approved = approve;
  build.save().then(() => res.send("OK"));
};

exports.uploadImages = async function (req, res) {
  const images = req.files;

  if (!images || !images.length) {
    errors.BAD_REQUEST.send(res);
    return;
  }

  await Image.bulkCreate(
    images.map((i) => ({
      filename: i.filename,
      creatorUuid: req.user?.uuid,
    }))
  ).then(async (images) =>
    res.send(await Promise.all(images.map((i) => i.toJSON())))
  );

  // const images = req.files?.images?.length
  //   ? req.files.images.map((i) => i.filename)
  //   : [];
};
