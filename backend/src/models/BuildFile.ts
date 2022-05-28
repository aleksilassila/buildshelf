import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ModelStatic,
  Model,
  NOW,
  CreationOptional,
} from "sequelize";
import sequelize from "../database";
import config from "../config";

export interface BuildFileModel extends BuildFileAttributes {
  getPath: () => string;
}

export interface BuildFileAttributes
  extends Model<
    InferAttributes<BuildFileAttributes>,
    InferCreationAttributes<BuildFileAttributes>
  > {
  filename: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
  version: number;
  minecraftDataVersion: number;
  x: number;
  y: number;
  z: number;
  blockCount: number;
  md5: string;
}

interface BuildFileStatic extends ModelStatic<BuildFileAttributes> {}

const BuildFile = <BuildFileStatic>sequelize.define<BuildFileAttributes>(
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

export { BuildFile };
