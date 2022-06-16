import { Router } from "express";
import * as collectionsController from "../controllers/collectionsController";
import { auth } from "../controllers/auth";
import { validateQuery, validateBody } from "../utils";
import routes from "./routes";

const collectionRoutes = Router();

collectionRoutes.get(
  routes.collections.get.search,
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
  collectionsController.search
);

collectionRoutes.get(
  routes.collections.get.get,
  collectionsController.getCollection
);

collectionRoutes.post(
  routes.collections.post.create,
  auth,
  validateBody({
    type: "object",
    properties: {
      title: { type: "string", maxLength: 255 },
      description: { type: "string" },
    },
  }),
  collectionsController.create
);

collectionRoutes.delete(
  routes.collections.delete.delete,
  auth,
  collectionsController.deleteCollection
);

collectionRoutes.put(
  routes.collections.put.update,
  auth,
  collectionsController.update
);

collectionRoutes.post(
  routes.collections.post.favorite,
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

export default collectionRoutes;
