import { Op } from "sequelize";
import {
  Build,
  BuildFile,
  Category,
  Collection,
  Image,
  Tag,
  User,
} from "../models";
import {
  parseLitematic,
  parseSimplifiedLitematic,
  writeLitematic,
} from "../utils";
import { ClientError, errors } from "../client-error";
import fs from "fs";
import { validate as validateJSON } from "jsonschema";
import crypto from "crypto";
import { Express } from "express";
import { AuthReq, BuildReq, OptionalAuthReq, Res } from "../../types";
import { Request } from "express/ts4.0";
import { MulterError } from "multer";

const canView = (res, build, user, message = "Build not found.") => {
  if (!build || !build.canView(user)) {
    errors.NOT_FOUND.send(res, message);
    return false;
  }

  return true;
};

const canEdit = (res, build, user, message = "Unauthorized.") => {
  if (!canView(res, build, user)) {
    return false;
  }

  if (!build || !build.canEdit(user)) {
    errors.UNAUTHORIZED.send(res, message);
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

const create = async function (req: AuthReq, res: Res) {
  const {
    description,
    name,
    categoryName,
    imageIds,
  }: {
    description?: string;
    name?: string;
    categoryName?: string;
    collectionId?: number;
    imageIds?: string[];
  } = req.body;
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

  if (categoryName) {
    if (!(await Category.findByPk(categoryName))) {
      errors.NOT_FOUND.send(res, "Category not found.");
      return;
    }
  }

  let collectionId;

  if (req.body?.collectionId) {
    if (
      !(await Collection.findOne({
        where: { id: req.body?.collectionId, creatorUuid: req.user.uuid },
      }))
    ) {
      errors.NOT_FOUND.send(res, "Collection not found.");
      return;
    } else {
      collectionId = req.body?.collectionId;
    }
  } else if (req.body?.collectionName && req.body?.collectionDescription) {
    collectionId = await Collection.create({
      name: req.body?.collectionName,
      description: req.body?.collectionDescription,
      creatorUuid: req.user.uuid,
    }).then((model) => model.id);
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
    name,
    description,
    creatorUuid: req.user.uuid,
    collectionId,
    categoryName,
    buildFileId: buildFile.id,
  });

  if (imageIds) {
    await build.setImagesById(imageIds);
  }

  // Add file id to the build file
  const litematicWithId = (
    await parseLitematic("uploads/" + buildFile.filename)
  )?.parsed;

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
      await buildFile.update({
        md5: hashSum.digest("hex"),
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

  res.send(await build.toJSON(req.user));

  try {
    await req.user.purgeImages();
  } catch (ignored) {
    console.log(ignored);
  }
};

const search = async function (
  req: OptionalAuthReq<Request<{}, {}, {}, any>>,
  res: Res
) {
  const { tags, collectionId, categoryName, sort } = req.query;

  Build.search(
    {
      where: {
        collectionId,
        categoryName: { [Op.startsWith]: categoryName },
      },
      order: {
        new: [["createdAt", "DESC"]],
        top: [["totalSaves", "DESC"]],
        popular: [["score", "DESC"]],
      }[sort || "new"],
      include: [
        {
          model: Tag,
          ...(tags && {
            where: {
              name: {
                [Op.in]: tags.map((i) => i.toLowerCase()),
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
    },
    req
  )
    .then(async (builds) => {
      res.send(await Build.toJSONArray(builds, req.user));
    })
    .catch((err) => ClientError.sendInternalError(err, res));
};

const downloadBuild = async function (req: BuildReq, res: Res) {
  res.download(
    "./uploads/" + req.build.buildFile.filename,
    req.build.buildFile.filename
  );
};

const get = async function (req: BuildReq, res: Res) {
  res.send(await req.build.toJSON(req.user));
  await req.build.addView(req.user);
};

const save = async function (req: BuildReq & AuthReq, res: Res) {
  const { user, build } = req;
  const shouldSave = req.body.save;

  const isSaved = await user.hasSavedBuild(build);

  if (shouldSave && !isSaved) {
    await user.addSavedBuild(build);
  } else if (!shouldSave && isSaved) {
    await user.removeSavedBuild(build);
  }

  await build.updateTotals();

  res.send(shouldSave ? "Build saved" : "Build unsaved");
};

const bookmark = async function (req: BuildReq & AuthReq, res: Res) {
  const { user, build } = req;
  const addBookmark = req.body.bookmark;

  const isSaved = await user.hasBookmark(build);

  if (addBookmark && !isSaved) {
    await user.addBookmark(build);
  } else if (!addBookmark && isSaved) {
    await user.removeBookmark(build);
  }

  res.send(addBookmark ? "Build bookmarked" : "Bookmark removed");
};

const update = async function (req: BuildReq & AuthReq, res: Res) {
  const { user, build } = req;
  const {
    description,
    name,
    collectionId,
    imageIds,
    private: isPrivate,
  }: {
    description?: string;
    name?: string;
    collectionId?: number;
    imageIds?: string[];
    private?: boolean;
  } = req.body;

  await build
    .update({
      description: description || build.description,
      name: name || build.name,
      collectionId: collectionId || build.collectionId,
      private: isPrivate !== undefined ? isPrivate : build.private,
    })
    .then(async () => {
      if (imageIds) {
        await build.setImagesById(imageIds);
      }
    })
    .then(() => res.send("OK"));
};

const deleteBuild = async function (req: BuildReq & AuthReq, res: Res) {
  req.build
    .destroy()
    .then(() => res.send("OK"))
    .catch((err) => ClientError.sendInternalError(err, res));
};

const approve = async function (req: BuildReq, res: Res) {
  const approve = req.body.approve;

  req.build.update({ approved: approve }).then(() => res.send("OK"));
};

const uploadImages = async function (
  req: AuthReq & { files: Express.Multer.File[] },
  res: Res,
  multerError: MulterError | undefined
) {
  const images = req.files;

  if (multerError?.code === "LIMIT_FILE_SIZE") {
    errors.FILE_TOO_LARGE.send(res);
    return;
  } else if (multerError) {
    ClientError.sendInternalError(multerError, res);
    return;
  }

  if (!images || !images.length) {
    errors.BAD_REQUEST.send(res);
    return;
  }

  await Image.bulkCreate(
    images?.map((i) => ({
      filename: i.filename,
      creatorUuid: req.user?.uuid,
    }))
  ).then(async (images) =>
    res.send(await Promise.all(images.map((i) => i.toJSON())))
  );
};

export {
  create,
  search,
  downloadBuild,
  get,
  save,
  bookmark,
  update,
  deleteBuild,
  approve,
  uploadImages,
};
