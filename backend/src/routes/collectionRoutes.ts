import { Router } from "express";
import * as collectionsController from "../controllers/collectionsController";
import { auth } from "../controllers/auth";
import { validateBody, validateQuery } from "../utils";
import routes from "./routes";
import { FindOptions } from "sequelize";
import { CollectionReq, Res } from "../../types";
import { Collection } from "../models";
import { errors } from "../client-error";

const collectionRoutes = Router();

const attachCollection =
  (options: FindOptions = {}) =>
  async (req: CollectionReq, res: Res, next) => {
    const { collectionId } = req.params;

    const collection: Collection = await Collection.findByPk(
      collectionId,
      options
    ).catch(() => undefined);

    if (!collection || !collection.canView(req.user)) {
      errors.NOT_FOUND.send(res);
      return;
    } else {
      req.collection = collection;
      next();
    }
  };

const attachOwnCollection =
  (options?: FindOptions) => async (req: CollectionReq, res: Res, next) => {
    await attachCollection(options)(req, res, async () => {
      if (!req.collection.canEdit(req.user)) {
        errors.UNAUTHORIZED.send(res);
        return;
      }

      next();
    });
  };

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
  attachCollection({ include: ["builds", "creator", "images"] }),
  collectionsController.getCollection
);

collectionRoutes.post(
  routes.collections.post.create,
  auth,
  validateBody({
    type: "object",
    properties: {
      name: { type: "string", maxLength: 255 },
      description: { type: "string" },
    },
  }),
  collectionsController.create
);

collectionRoutes.delete(
  routes.collections.delete.delete,
  auth,
  attachOwnCollection(),
  collectionsController.deleteCollection
);

collectionRoutes.put(
  routes.collections.put.update,
  auth,
  attachOwnCollection(),
  collectionsController.update
);

collectionRoutes.post(
  routes.collections.post.favorite,
  auth,
  attachCollection(),
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
