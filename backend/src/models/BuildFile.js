const { DataTypes, NOW } = require("sequelize");
const { sequelize } = require("../database");
const { config } = require("../config");

const BuildFile = sequelize.define(
  "buildFile",
  {
    filename: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.INTEGER, allowNull: false },
    minecraftDataVersion: { type: DataTypes.INTEGER, allowNull: false },
    x: { type: DataTypes.INTEGER, allowNull: false },
    z: { type: DataTypes.INTEGER, allowNull: false },
    y: { type: DataTypes.INTEGER, allowNull: false },
    blockCount: { type: DataTypes.INTEGER, allowNull: false },
    md5: { type: DataTypes.STRING, allowNull: false },
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

BuildFile.prototype.getPath = function () {
  return `${config.UPLOAD_DIRECTORY}/${this.filename}`;
};

module.exports = { BuildFile };
