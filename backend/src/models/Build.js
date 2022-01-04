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
  },
  totalFavorites: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
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
  const creator = await this.getCreator();

  let isFavorite = null;

  if (user) {
    for (const favorite of await user.getFavoriteBuilds({ attributes: ["id"] })) {
      if (favorite.id === this.id) {
        isFavorite = true;
        break;
      }
    }

    isFavorite = isFavorite !== null;
  }

  return {
    id: this.id,
    title: this.title,
    description: this.description,
    thisFile: this.thisFile,
    images: this.images,
    downloads: this.downloads,
    totalFavorites: await this.countTotalFavorites(),
    creator: {
      username: creator.username,
      uuid: creator.uuid,
    },
    category: await this.getCategory(),
    tags: await this.getTags(),
    collection: await this.getCollection(),
    uploadedAt: this.createdAt,
    isFavorite,
  };
};

module.exports = { Build };
