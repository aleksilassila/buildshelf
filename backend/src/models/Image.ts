import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NOW,
} from "sequelize";
import sequelize from "../database";
import User, { UserJSON } from "./User";
import Build from "./Build";
import { UPLOAD_DIRECTORY } from "../config";

export interface ImageJSON {
  createdAt: string;
  creator: UserJSON | undefined;
  filename: string;
  id: number;
  updatedAt: string;
}

class Image extends Model<
  InferAttributes<Image>,
  InferCreationAttributes<Image>
> {
  declare id?: CreationOptional<number>;
  declare filename: string;
  declare createdAt: string;
  declare updatedAt: string;

  declare creator?: CreationOptional<User>;

  declare getBuilds: HasManyGetAssociationsMixin<Build>;

  getPath(): string {
    return `${UPLOAD_DIRECTORY}/${this.filename}`;
  }

  async toJSON(): Promise<ImageJSON> {
    return {
      id: this.id,
      filename: this.filename,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: this.creator ? await this.creator.toJSON() : undefined,
    };
  }
}

Image.init(
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
  { sequelize, modelName: "image", timestamps: false }
);

export default Image;
