import express from "express";
import cors from "cors";
import cron from "node-cron";

import tagsController from "./controllers/tagsController";
import categoriesController from "./controllers/categoriesController";
import { loginClient, loginMicrosoft, optionalAuth } from "./controllers/auth";

import sequelize from "./database";
import { errors, middleware as errorMiddleware } from "./client-error";
import buildRoutes from "./routes/buildRoutes";
import userRoutes from "./routes/userRoutes";
import client from "./routes/clientRoutes";
import Build from "./models/Build";
import { Op } from "sequelize";
import * as config from "./config";

cron.schedule("*/15 * * * *", async () => {
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
api.post("/login/microsoft", loginMicrosoft);
api.post("/login/token", loginClient);

api.use(userRoutes);
// api.use(collections);
api.use(buildRoutes);
api.use(client);

app.use("/api", api);

app.use((req, res) => {
  errors.ROUTE_NOT_FOUND.send(res);
});

sequelize.sync({ force: false }).then(() => {
  console.log("App listening on port 9000");

  console.log("Config values", config);

  app.listen(9000);
});
