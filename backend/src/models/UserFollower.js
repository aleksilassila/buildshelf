const { DataTypes, Op, STRING } = require("sequelize");
const { sequelize } = require("../database");

const UserFollower = sequelize.define("userFollower", {
  followerUuid: DataTypes.STRING,
  followedUuid: DataTypes.STRING,
});

module.exports = { UserFollower };
