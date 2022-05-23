const buildsController = require("../controllers/buildsController");
const { Router } = require("express");
const { auth, moderatorAuth } = require("../controllers/auth");
const multer = require("multer");
const config = require("../config");
const { validateQuery, validateBody } = require("../utils");
const path = require("path");
const fs = require("fs");
const { parse, writeUncompressed } = require("prismarine-nbt");
const { bookmark } = require("../controllers/buildsController");

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
    fileSize: "15MB",
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
        if (!/image\/png|image\/jpge|image\/gif/.test(file.mimetype)) {
          return cb(null, false);
        }
        break;
      }
    }
    return cb(null, true);
  },
});

buildRoutes.get("/files/id/:buildId", buildsController.downloadBuild);

buildRoutes.post(
  "/build/create",
  auth,
  upload.fields([
    { name: "buildFile", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  validateBody({
    type: "object",
    properties: {
      title: { type: "string", maxLength: 255 },
      description: { type: "string" },
      category: { type: "string" },
      collectionId: { type: "number" },
      tags: { type: "string" },
      // tags: {
      //   type: "array",
      //   items: { type: "string" },
      //   minItems: 0,
      //   uniqueItems: true,
      //   maxItems: 3,
      // },
    },
    required: ["title", "description"],
  }),
  buildsController.create
);

buildRoutes.get(
  "/builds/get",
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
      sort: { enum: ["top", "new"] },
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

buildRoutes.get("/builds/get/followed", auth, buildsController.getFollowed);

buildRoutes.get("/build/:buildId", buildsController.get);
buildRoutes.post(
  "/build/:buildId/save",
  auth,
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
  "/build/:buildId/bookmark",
  auth,
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
  "/build/:buildId",
  auth,
  validateBody({
    type: "object",
    properties: {
      title: { type: "string", maxLength: 255 },
      description: { type: "string" },
      // category: { type: "string" },
      collectionId: { type: "number" },
      // tags: { type: "string" },
    },
    required: [],
  }),
  buildsController.update
);

buildRoutes.post(
  "/build/:buildId/approve",
  moderatorAuth,
  validateBody({
    type: "object",
    properties: {
      approve: { type: "boolean" },
    },
    required: ["approve"],
  }),
  buildsController.approve
);

module.exports = buildRoutes;
