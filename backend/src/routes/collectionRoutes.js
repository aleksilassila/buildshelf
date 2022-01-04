const { Router } = require("express");
const collectionRoutes = Router();
const collectionsController = require("../controllers/collectionsController");
const { auth } = require("../controllers/auth");
const { validateQuery, validateBody } = require("../utils");

collectionRoutes.get(
  "/collections/get",
  validateQuery({
    type: "object",
    properties: {
      category: { type: "string" },
      name: { type: "string" },
      sort: { enum: ["top", "new"] },
      uuid: { type: "string" },
      timespan: { type: "number" },
      offset: { type: "number", minimum: 0 },
      amount: { type: "number", minimum: 1, maximum: 50 },
    },
    required: [],
  }),
  collectionsController.getCollections
);

collectionRoutes.post(
  "/collection/create",
  auth,
  collectionsController.createCollection
);
collectionRoutes.delete(
  "/collection/:collectionId",
  auth,
  collectionsController.deleteCollection
);

collectionRoutes.put(
  "/collection/:collectionId",
  auth,
  collectionsController.modify
);


collectionRoutes.post(
  "/collection/:collectionId/favorite",
  auth,
  validateBody({
    type: "object",
    properties: {
      favorite: { type: "boolean" },
    },
    required: ["favorite"],
  }),
  collectionsController.favorite
);

module.exports = collectionRoutes;
