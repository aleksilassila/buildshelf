import { Router } from "express";
import { auth } from "../controllers/auth";
import * as userController from "../controllers/userController";
import { validateBody } from "../utils";
import routes from "./routes";

const userRoutes = Router();

userRoutes.get(routes.users.get.get, userController.getUser);
userRoutes.get(routes.users.get.saves, userController.getSaves);
userRoutes.get(routes.users.get.bookmarks, auth, userController.getBookmarks);
userRoutes.post(
  routes.users.post.follow,
  auth,
  validateBody({
    type: "object",
    properties: {
      follow: { type: "boolean" },
    },
    required: ["follow"],
  }),
  userController.follow
);
userRoutes.get(routes.users.get.feed, auth, userController.getFeed);

export default userRoutes;
