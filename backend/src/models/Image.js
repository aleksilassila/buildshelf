const { DataTypes, NOW } = require("sequelize");
const { sequelize } = require("../database");

const Image = sequelize.define(
  "image",
  {
    filename: { type: DataTypes.STRING, allowNull: false },
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

Image.prototype.toJSON = async function () {
  return {
    id: this.id,
    filename: this.filename,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    creator: this.creator ? await this.creator.toJSON() : null,
  };
};

module.exports = { Image };
