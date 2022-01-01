const { Router } = require("express");
const { auth } = require("../controllers/auth");
const userRoutes = Router();
const userController = require("../controllers/userController");

userRoutes.get("/user/:uuid", userController.getUser);
userRoutes.get("/user/:uuid/favorites", userController.getUserFavorites);
userRoutes.get("/user/:uuid/saves", auth, userController.getUserSaves);
userRoutes.get("/user/:uuid/collections", userController.getUserCollections);
userRoutes.post("/user/:uuid/follow", auth, userController.follow);

module.exports = userRoutes;
