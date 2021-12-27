const { User, Build, Collection } = require("../models/index");
const { UserFollower } = require("../models/UserFollower");

exports.getUser = async function (req, res) {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid,
    },
    include: [],
  });

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
  });

  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  res.send(
    await Promise.all(
      (await user.getFavorites()).map((build) => build.toJSON(req.user))
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

exports.getUserCollections = async function (req, res) {
  const { uuid } = req.params;

  if (!uuid) {
    res.status(400).send("User id not found.");
    return;
  }

  res.send(
    await Collection.findAll({
      where: {
        ownerId: uuid,
      },
    })
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
  });

  if (!targetUser) {
    res.status(404).send("User not found");
    return;
  }

  const isFollowing = await targetUser.hasFollower(user);

  if (follow && !isFollowing) {
    await targetUser.addFollower(user);
  } else if (!follow && isFollowing) {
    await targetUser.removeFollower(user);
  }

  await targetUser.save();

  res.send("OK");
};
