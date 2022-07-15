import express from "express";
import cors from "cors";
require("dotenv").config();
import cron from "node-cron";

import tagsController from "./src/controllers/tagsController";
import categoriesController from "./src/controllers/categoriesController";
import {
  optionalAuth,
  loginMojang,
  loginClient,
  loginMicrosoft,
} from "./src/controllers/auth";

import sequelize from "./src/database";
import { errors, middleware as errorMiddleware } from "./src/client-error";
import buildRoutes from "./src/routes/buildRoutes";
import userRoutes from "./src/routes/userRoutes";
import collections from "./src/routes/collectionRoutes";
import client from "./src/routes/clientRoutes";
import Build from "./src/models/Build";
import { Op } from "sequelize";

cron.schedule("*/15 * * * *", async () => {
  // Update views, downloads and saves
  await Build.cache.writeAll();

  // Update popularity score
  Build.findAll({
    where: {
      createdAt: {
        [Op.gt]: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
      private: false,
      approved: true,
    },
  }).then((builds) => {
    console.log("Builds: ", builds.length);
    builds.forEach((build) => {
      build
        .updateScore()
        .then((model) => console.log("Score for build", model.id, model.score));
    });
  });
});

const app = express();
const api = express.Router();

app.use(
  cors({
    origin: "*",
  })
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error: ", err));

api.use("/files", express.static("uploads"));
api.use(express.json());

app.use(errorMiddleware);
api.use(optionalAuth);

api.get("/tags", tagsController.getTags);
api.get("/categories", categoriesController.getCategories);
api.post("/login/mojang", loginMojang);
api.post("/login/microsoft", loginMicrosoft);
api.post("/login/token", loginClient);

api.use(userRoutes);
api.use(collections);
api.use(buildRoutes);
api.use(client);

app.use("/api", api);

app.use((req, res) => {
  errors.ROUTE_NOT_FOUND.send(res);
});

sequelize.sync({ force: false }).then(() => {
  console.log("App listening on port 9000");
  app.listen(9000);
});
