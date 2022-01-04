const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Collection = sequelize.define("collection", {
  name: {
    type: DataTypes.STRING,
  },
  description: DataTypes.STRING,
  image: DataTypes.STRING,
  // This acts as a kind of cache for sorting the queries
  _totalFavorites: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Collection.prototype.countTotalFavorites = function () {
  return sequelize.model("userFavoriteCollections").count({
    where: {
      collectionId: this.id,
    },
  });
};

Collection.prototype.updateTotalFavorites = async function () {
  this._totalFavorites = await this.countTotalFavorites();
  await this.save();
};

Collection.exists = function (name, ownerId) {
  return Collection.findOne({ where: { name, ownerId } }) !== null;
};

Collection.getOrCreateCollection = function (name, description, ownerId) {
  return Collection.findOrCreate({
    where: {
      ownerId,
      name,
    },
    defaults: {
      ownerId,
      description: description || "",
      name,
    },
  });
};

module.exports = { Collection };
