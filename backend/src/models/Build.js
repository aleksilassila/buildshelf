const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Build = sequelize.define("build", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  buildFile: { type: DataTypes.STRING, allowNull: false },
  images: DataTypes.ARRAY(DataTypes.STRING),
  totalDownloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  totalFavorites: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
  }
});

Build.prototype.countTotalFavorites = function () {
  return sequelize.model("userFavoriteBuilds").count({
    where: {
      buildId: this.id,
    },
  });
};

Build.prototype.updateTotalFavorites = async function () {
  this.totalFavorites = await this.countTotalFavorites();
  await this.save();
};

Build.prototype.toJSON = async function (user = null) {
  let isFavorite = user
    ? !!(await user.getFavoriteBuilds({
        attributes: ["id"],
        where: { id: this.id },
      }))
    : undefined;

  return {
    id: this.id,
    title: this.title,
    description: this.description,
    buildFile: this.buildFile,
    images: this.images,
    totalDownloads: this.totalDownloads,
    totalFavorites: this.totalFavorites,
    creator: this.creator ? await this.creator.toJSON() : undefined,
    category: await this.getCategory(),
    tags: await this.getTags(),
    collection: this.collection ? await this.collection.toJSON() : undefined,
    createdAt: this.createdAt,
    isFavorite,
  };
};

module.exports = { Build };
