import express from "express";
import cors from "cors";
require("dotenv").config();

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
import builds from "./src/routes/buildRoutes";
import users from "./src/routes/userRoutes";
import collections from "./src/routes/collectionRoutes";
import client from "./src/routes/clientRoutes";

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

api.use(users);
api.use(collections);
api.use(builds);
api.use(client);

app.use("/api", api);

app.use((req, res) => {
  errors.ROUTE_NOT_FOUND.send(res);
});

sequelize.sync({ force: false }).then(() => {
  console.log("App listening on port 9000");
  app.listen(9000);
});
