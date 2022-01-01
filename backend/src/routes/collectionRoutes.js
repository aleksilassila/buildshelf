const { Router } = require("express");
const collectionRoutes = Router();
const collectionsController = require("../controllers/collectionsController");
const { auth } = require("../controllers/auth");
const { validateQuery } = require("../utils");



collectionRoutes.get("/collectionRoutes/get", auth, collectionsController.getCollections);
collectionRoutes.post(
  "/collectionRoutes/create",
  auth,
  collectionsController.createCollection
);
collectionRoutes.delete(
  "/collectionRoutes/:collectionId/delete",
  auth,
  collectionsController.deleteCollection
);

module.exports = collectionRoutes;
