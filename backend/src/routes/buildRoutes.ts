import { BuildReq, Res } from "../../types";

import * as buildsController from "../controllers/buildsController";
import { Router } from "express";
import { auth, moderatorAuth } from "../controllers/auth";
import multer from "multer";
import config from "../config";
import { validateBody, validateQuery } from "../utils";
import path from "path";
import { errors } from "../client-error";
import { Build } from "../models";
import { FindOptions } from "sequelize";
import routes from "./routes";

const buildRoutes = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_DIRECTORY);
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + fileExtension);
  },
});

const upload = multer({
  storage,
  limits: {
    // parts: 6,
    fileSize: 1024 * 1024 * 15,
  },
  fileFilter: function (req, file, cb) {
    switch (file.fieldname) {
      case "buildFile": {
        if (
          file.mimetype !== "application/octet-stream" ||
          path.extname(file.originalname).toLowerCase() !== ".litematic"
        ) {
          return cb(null, false);
        }
        break;
      }
      case "images": {
        if (!/image\/png|image\/jpeg|image\/gif/.test(file.mimetype)) {
          return cb(null, false);
        }
        break;
      }
    }
    return cb(null, true);
  },
});

const attachBuild =
  (options: FindOptions = {}) =>
  async (req: BuildReq, res: Res, next) => {
    const buildId = req.params.buildId;

    const build = await Build.findByPk(buildId, options).catch(() => undefined);

    if (!build || !build.canView(req.user)) {
      errors.NOT_FOUND.send(res);
      return;
    } else {
      req.build = build;
      next();
    }
  };

const attachOwnBuild =
  (options?: FindOptions) => async (req: BuildReq, res: Res, next) => {
    await attachBuild(options)(req, res, async () => {
      if (!req.build.canEdit(req.user)) {
        errors.UNAUTHORIZED.send(res);
        return;
      }

      next();
    });
  };

buildRoutes.get(
  routes.builds.get.download,
  attachBuild({ include: ["buildFile"] }),
  buildsController.downloadBuild
);

buildRoutes.post(
  routes.builds.post.create,
  auth,
  upload.single("buildFile"),
  validateBody({
    type: "object",
    properties: {
      title: { type: "string", maxLength: 255 },
      description: { type: "string" },
      category: { type: "string" },
      collectionId: { type: "number" },
      collectionName: { type: "string" },
      collectionDescription: { type: "string" },
      tags: {
        type: "array",
        items: { type: "string" },
        minItems: 0,
        maxItems: 3,
        uniqueItems: true,
      },
      imageIds: {
        type: "array",
        items: { type: "string" },
        minItems: 0,
        maxItems: 3,
        uniqueItems: true,
      },
    },
    required: ["title", "description"],
  }),
  buildsController.create
);

buildRoutes.get(
  routes.builds.get.search,
  validateQuery({
    type: "object",
    properties: {
      tags: {
        type: "array",
        items: {
          type: "string",
          minItems: 1,
        },
      },
      collection: { type: "number" },
      category: { type: "string" },
      title: { type: "string" },
      sort: { enum: ["top", "new", "popular"] },
      uuid: { type: "string" },
      approved: { type: "boolean" },
      includePrivate: { type: "boolean" },
      timespan: { type: "number" },
      offset: { type: "number", minimum: 0 },
      amount: { type: "number", minimum: 1, maximum: 50 },
    },
    required: [],
  }),
  buildsController.search
);

buildRoutes.get(
  routes.builds.get.get,
  attachBuild({ include: ["collection", "creator", "images"] }),
  buildsController.get
);

buildRoutes.post(
  routes.builds.post.save,
  auth,
  attachBuild(),
  validateBody({
    type: "object",
    properties: {
      save: { type: "boolean" },
    },
    required: ["save"],
  }),
  buildsController.save
);

buildRoutes.post(
  routes.builds.post.bookmark,
  auth,
  attachBuild(),
  validateBody({
    type: "object",
    properties: {
      bookmark: { type: "boolean" },
    },
    required: ["bookmark"],
  }),
  buildsController.bookmark
);

buildRoutes.put(
  routes.builds.put.update,
  auth,
  attachOwnBuild({ include: ["collection", "creator"] }),
  validateBody({
    type: "object",
    properties: {
      title: { type: "string", maxLength: 255 },
      description: { type: "string" },
      // category: { type: "string" },
      collectionId: { type: "number" },
      imageIds: {
        type: "array",
        items: { type: "string" },
        minItems: 0,
        maxItems: 5,
      },
      private: { type: "boolean" },
      // tags: { type: "string" },
    },
    required: [],
  }),
  buildsController.update
);

buildRoutes.delete(
  "/builds/:buildId",
  auth,
  attachOwnBuild(),
  buildsController.deleteBuild
);

buildRoutes.post(
  routes.builds.post.approve,
  moderatorAuth,
  attachBuild(),
  validateBody({
    type: "object",
    properties: {
      approve: { type: "boolean" },
    },
    required: ["approve"],
  }),
  buildsController.approve
);

buildRoutes.post(
  routes.builds.post.approve,
  auth,
  upload.array("images", 5),
  buildsController.uploadImages
);

export default buildRoutes;
