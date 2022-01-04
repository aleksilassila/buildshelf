const { DataTypes } = require("sequelize");
const { sequelize } = require("../../database");

const UserFollows = sequelize.define("userFollows", {
  followerUuid: DataTypes.STRING,
  followedUuid: DataTypes.STRING,
}, {
  timestamps: false,
});

module.exports = { UserFollows };
