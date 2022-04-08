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
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // FIXME prod
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

Build.prototype.hasAccess = function (user = null) {
  if (user?.moderator === true) return true;
  if (this.private || !this.approved) {
    if (!user || user.uuid !== this.creator?.uuid) {
      return false;
    }
  }

  return true;
};

Build.prototype.toJSON = async function (user = null) {
  if (!this.hasAccess(user)) {
    return undefined;
  }

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
    private: this.private,
    ...(!!user?.moderator && { approved: this.approved }),
    isSaved,
  };
};

Build.toJSONArray = function (builds, user = null) {
  return Promise.all(builds.map((b) => b.toJSON(user))).then((res) =>
    res.filter((i) => i !== undefined)
  );
};

module.exports = { Build };
