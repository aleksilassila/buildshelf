const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Collection = sequelize.define("collection", {
  name: {
    type: DataTypes.STRING,
  },
  description: DataTypes.TEXT,
  image: DataTypes.ARRAY(DataTypes.STRING),
  totalFavorites: {
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
  this.totalFavorites = await this.countTotalFavorites();
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

Collection.prototype.toJSON = async function (user = null) {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    image: this.image,
    totalFavorites: this.totalFavorites,
    builds: this.builds
      ? await Promise.all(this.builds.map((build) => build.toJSON(user)))
      : undefined,
    creator: this.creator ? await this.creator.toJSON() : undefined,
  };
};

module.exports = { Collection };
