import {
  DataTypes,
  NOW,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ModelStatic,
  CreationOptional,
} from "sequelize";
import sequelize from "../database";
import config from "../config";
import { UserJSON } from "./User";

export interface ImageModel extends ImageAttributes {
  toJSON: () => Promise<ImageJSON>;
}

export interface ImageAttributes
  extends Model<
    InferAttributes<ImageAttributes>,
    InferCreationAttributes<ImageAttributes>
  > {
  id?: CreationOptional<number>;
  filename: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageStatic extends ModelStatic<ImageAttributes> {}

const Image = <ImageStatic>sequelize.define<ImageAttributes>(
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

export interface ImageJSON {
  createdAt: string;
  creator: UserJSON | undefined;
  filename: string;
  id: number;
  updatedAt: string;
}

Image.prototype.toJSON = async function (): Promise<ImageJSON> {
  return {
    id: this.id,
    filename: this.filename,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    creator: this.creator ? await this.creator.toJSON() : undefined,
  };
};

Image.prototype.getPath = function () {
  return `${config.UPLOAD_DIRECTORY}/${this.filename}`;
};

export { Image };
