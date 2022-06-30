import { Build, User } from "../models/index";
import { errors } from "../client-error";
import { AuthReq, Res } from "../../types";
import { Op } from "sequelize";

const getUser = async function (req, res) {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid,
    },
    include: ["follows", "savedBuilds"],
  }).catch((err) => {});

  if (!user) {
    errors.NOT_FOUND.send(res, "User not found");
    return;
  }

  res.send(await user.toJSON(req.user));
};

const getSaves = async function (req, res) {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid,
    },
  }).catch((err) => {});

  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  res.send(
    await Promise.all(
      (
        await user.getSavedBuilds({ include: ["creator", "collection"] })
      ).map((build) => build.toJSON(req.user))
    )
  );
};

const getBookmarks = async function (req, res) {
  const { uuid } = req.params;

  if (uuid !== req.user.uuid) {
    errors.UNAUTHORIZED.send(res);
    return;
  }

  const user = await User.findOne({
    where: {
      uuid,
    },
  }).catch((err) => {});

  if (!user) {
    errors.NOT_FOUND.send(res, "User not found.");
    return;
  }

  res.send(
    await Promise.all(
      (await user.getBookmarks()).map((build) => build.toJSON(req.user))
    )
  );
};

const follow = async function (req, res) {
  const user = req.user;
  const { uuid } = req.params;
  const follow = req.body.follow;

  const targetUser = await User.findOne({
    where: {
      uuid,
    },
  }).catch((err) => {});

  if (!targetUser) {
    errors.NOT_FOUND.send(res, "User not found");
    return;
  }

  const isFollowing = await user.hasFollow(targetUser);

  if (follow && !isFollowing) {
    await user.addFollow(targetUser);
  } else if (!follow && isFollowing) {
    await user.removeFollow(targetUser);
  }

  res.send("OK");
};

const getFeed = async function (req: AuthReq, res: Res) {
  const user = req.user;
  const follows = (await user.getFollows()).map((u) => u.uuid);

  const builds = await Build.findAll({
    order: [["createdAt", "DESC"]],
    include: {
      model: User,
      as: "creator",
      where: {
        uuid: { [Op.in]: follows },
      },
    },
  });

  res.send(await Build.toJSONArray(builds, user));
};

export { getUser, getSaves, getBookmarks, follow, getFeed };
