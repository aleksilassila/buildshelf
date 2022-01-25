const { User, Collection } = require("../models/index");
const {errors} = require("../client-error");

exports.getUser = async function (req, res) {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid,
    },
    include: ["follows", "savedBuilds"],
  }).catch(err => {});

  if (!user) {
    errors.NOT_FOUND.send(res, "User not found");
    return;
  }

  res.send(await user.toJSON(req.user));
};

exports.getSaves = async function (req, res) {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid,
    },
  }).catch(err => {});

  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  res.send(
    await Promise.all(
      (await user.getSavedBuilds({ include:  ["creator", "collection"]})).map((build) => build.toJSON(req.user))
    )
  );
};

exports.getBookmarks = async function (req, res) {
  const { uuid } = req.params;

  if (uuid !== req.user.uuid) {
    errors.UNAUTHORIZED.send(res);
    return;
  }

  const user = await User.findOne({
    where: {
      uuid,
    },
  }).catch(err => {});

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

exports.follow = async function (req, res) {
  const user = req.user;
  const { uuid } = req.params;
  const follow = req.body.follow;

  const targetUser = await User.findOne({
    where: {
      uuid,
    },
  }).catch(err => {});

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
