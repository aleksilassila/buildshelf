const { DataTypes, NOW } = require("sequelize");
const { sequelize } = require("../database");

const Build = sequelize.define(
  "build",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    buildFile: { type: DataTypes.JSONB, allowNull: false },
    images: DataTypes.ARRAY(DataTypes.STRING),
    totalDownloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalSaves: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
  },
  { timestamps: false }
);

Build.prototype.countTotalSaves = function () {
  return sequelize.model("userSavedBuilds").count({
    where: {
      buildId: this.id,
    },
  });
};

Build.prototype.updateTotalSaves = async function () {
  this.totalSaves = await this.countTotalSaves();
  await this.save();
};

Build.prototype.toJSON = async function (user = null) {
  let isSaved = user
    ? !!(
        await user.getSavedBuilds({
          attributes: ["id"],
          where: { id: this.id },
        })
      )?.length
    : undefined;

  return {
    id: this.id,
    title: this.title,
    description: this.description,
    buildFile: this.buildFile,
    images: this.images,
    totalDownloads: this.totalDownloads,
    totalSaves: this.totalSaves,
    creator: this.creator ? await this.creator.toJSON() : undefined,
    category: await this.getCategory(),
    tags: await this.getTags(),
    collection: this.collection ? await this.collection.toJSON() : undefined,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isSaved,
  };
};

module.exports = { Build };
