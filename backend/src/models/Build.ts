import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  NOW,
  Op,
} from "sequelize";

import sequelize from "../database";
import { UserJSON, UserModel } from "./User";
import { ImageJSON } from "./Image";
import { CollectionJSON } from "./Collection";
import { TagModel } from "./Tag";
import { BuildFileModel } from "./BuildFile";
import { CategoryModel } from "./Category";

const { Image } = require("./Image");

export interface BuildModel extends BuildAttributes {
  toJSON: (user?: UserModel) => any;
}

export interface BuildAttributes
  extends Model<
    InferAttributes<BuildAttributes>,
    InferCreationAttributes<BuildAttributes>
  > {
  id?: CreationOptional<number>;
  title: string;
  description: string;
  totalDownloads: CreationOptional<number>;
  totalSaves: CreationOptional<number>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
  private: CreationOptional<boolean>;
  approved: CreationOptional<boolean>;
}

interface BuildStatic extends ModelStatic<BuildAttributes> {
  toJSONArray: (builds: BuildModel[], user: any) => void;
}

const Build = <BuildStatic>sequelize.define<BuildAttributes>(
  "build",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
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

Build.prototype.setImagesById = async function (imageIds: string[]) {
  return this.setImages(
    await Image.findAll({ where: { id: { [Op.in]: imageIds } } })
  );
};

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

Build.prototype.hasAccess = function (user: UserModel = null) {
  if (user?.moderator === true) return true;
  if (this.private || !this.approved) {
    if (!user || user?.uuid !== this.creator?.uuid) {
      return false;
    }
  }

  return true;
};

Build.toJSONArray = function (builds: BuildModel[], user: any = null) {
  return Promise.all(builds.map((b) => b.toJSON(user))).then((res) =>
    res.filter((i) => i !== undefined)
  );
};

export interface BuildJSON {
  images: ImageJSON[] | undefined;
  creator: UserJSON | undefined;
  private: boolean;
  totalDownloads: number;
  description: string;
  collection: CollectionJSON | undefined;
  title: string;
  tags: TagModel[];
  totalSaves: number;
  createdAt: string;
  buildFile: BuildFileModel;
  approved: boolean;
  isSaved: boolean;
  id: number;
  category: CategoryModel;
  updatedAt: string;
}

Build.prototype.toJSON = async function (
  user: UserModel = null
): Promise<BuildJSON> {
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
    buildFile: await this.getBuildFile(),
    images: this.images
      ? await Promise.all(this.images.map((i) => i.toJSON()))
      : undefined,
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

export { Build };
