const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  remoteId: DataTypes.UUID,
});

User.prototype.toJSON = async function () {
  return {
    username: this.username,
    uuid: this.uuid,
    favorites: this.favoriteBuilds
      ? await Promise.all(this.favoriteBuilds.map((b) => b.toJSON()))
      : undefined,
    follows: this.follows
      ? await Promise.all(this.follows.map((u) => u.toJSON()))
      : undefined,
  };
};

module.exports = { User };
