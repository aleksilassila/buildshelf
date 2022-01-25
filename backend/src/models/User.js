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

User.prototype.toJSON = async function (user = null) {
  return {
    username: this.username,
    uuid: this.uuid,
    saves: this.savedBuilds
      ? await Promise.all(this.savedBuilds.map((b) => b.toJSON()))
      : undefined,
    follows: this.follows
      ? await Promise.all(this.follows.map((u) => u.toJSON()))
      : undefined,
    following: user ? await user.hasFollow(this.uuid) : undefined,
  };
};

module.exports = { User };
