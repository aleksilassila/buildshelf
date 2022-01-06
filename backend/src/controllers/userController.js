const { User, Collection } = require("../models/index");

exports.getUser = async function (req, res) {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid,
    },
    include: ["follows", "favoriteBuilds"],
  }).catch(err => {});

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.send(await user.toJSON());
};

exports.getUserFavorites = async function (req, res) {
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
      (await user.getFavoriteBuilds({ include:  ["creator", "collection"]})).map((build) => build.toJSON(req.user))
    )
  );
};

exports.getUserSaves = async function (req, res) {
  const { uuid } = req.params;

  if (uuid !== req.user.uuid) {
    res.status(401).send("Unauthorized");
    return;
  }

  const user = await User.findOne({
    where: {
      uuid,
    },
  });

  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  res.send(
    await Promise.all(
      (await user.getSaves()).map((build) => build.toJSON(req.user))
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
    res.status(404).send("User not found");
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
