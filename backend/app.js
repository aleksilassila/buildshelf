const express = require("express");
const cors = require("cors");
require('dotenv').config();

const tagsController = require("./src/controllers/tagsController");
const categoriesController = require("./src/controllers/categoriesController");
const { optionalAuth, loginMojang, loginClient, loginMicrosoft} = require("./src/controllers/auth");

const { sequelize } = require("./src/database");
const { errors } = require("./src/client-error");
const builds = require("./src/routes/buildRoutes");
const users = require("./src/routes/userRoutes");
const collections = require("./src/routes/collectionRoutes");
const errorMiddleware = require("./src/client-error").middleware;

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
api.post("/login/token", loginClient)

api.use(users);
api.use(collections);
api.use(builds);

app.use("/api", api);

app.use((req, res) => {
  errors.ROUTE_NOT_FOUND.send(res);
});

sequelize.sync({ force: false }).then(() => {
  console.log("App listening on port 9000");
  app.listen(9000);
});
