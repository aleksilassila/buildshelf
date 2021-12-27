const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../database");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uuid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  remoteId: DataTypes.STRING,

});

User.prototype.toJSON = async function () {
  return {
    username: this.username,
    uuid: this.uuid,
    remoteId: this.remoteId,
    favorites: await Promise.all((await this.getFavorites()).map(f => f.toJSON())),
    followers: (await this.getFollowers({ attributes: ["uuid"] })).map(f => f.uuid),
    followings: (await this.getFollowings({ attributes: ["uuid"] })).map(f => f.uuid),
  };
};

module.exports = { User };
