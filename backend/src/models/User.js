const { DataTypes, Op } = require("sequelize");
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
    remoteId: this.remoteId,
    favorites: await Promise.all((await this.getFavoriteBuilds()).map(f => f.toJSON())),
    // followers: (await this.getFollowers({ attributes: ["uuid"] })).map(f => f.uuid),
    follows: (await this.getFollows({ attributes: ["uuid"] })).map(f => f.uuid),
  };
};

module.exports = { User };
