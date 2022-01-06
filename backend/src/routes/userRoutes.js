const { Router } = require("express");
const { auth } = require("../controllers/auth");
const userRoutes = Router();
const userController = require("../controllers/userController");
const {validateBody} = require("../utils");

userRoutes.get("/user/:uuid", userController.getUser);
userRoutes.get("/user/:uuid/favorites", userController.getUserFavorites);
// userRoutes.get("/user/:uuid/saves", auth, userController.getUserSaves);
userRoutes.post("/user/:uuid/follow", auth,   validateBody({
    type: "object",
    properties: {
      follow: { type: "boolean" },
    },
    required: ["follow"],
  }), userController.follow);

module.exports = userRoutes;
