import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
} from "sequelize";
import sequelize from "../database";
import { BuildJSON } from "./Build";
import { UserJSON, UserModel } from "./User";
import { ImageJSON } from "./Image";
import { Build } from "./index";

export interface CollectionModel extends CollectionAttributes {
  toJSON: (user?: UserModel) => Promise<CollectionJSON>;
  updateTotalFavorites: () => Promise<CollectionModel>;
}

export interface CollectionAttributes
  extends Model<
    InferAttributes<CollectionAttributes>,
    InferCreationAttributes<CollectionAttributes>
  > {
  id?: CreationOptional<number>;
  name: string;
  description: string;
  totalFavorites: CreationOptional<number>;
  creatorUuid?: CreationOptional<string>;
}

interface CollectionStatic extends ModelStatic<CollectionModel> {
  exists: (name: string, ownerId: string) => Promise<boolean>;
  getOrCreateCollection: (
    name: string,
    description: string,
    ownerId: string
  ) => Promise<[CollectionModel, boolean]>;
}

const Collection = <CollectionStatic>sequelize.define<CollectionAttributes>(
  "collection",
  {
    name: {
      type: DataTypes.STRING,
    },
    description: DataTypes.TEXT,
    totalFavorites: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }
);

Collection.prototype.countTotalFavorites = function (): Promise<number> {
  return sequelize.model("userFavoriteCollections").count({
    where: {
      collectionId: this.id,
    },
  });
};

Collection.prototype.updateTotalFavorites =
  async function (): Promise<CollectionModel> {
    this.totalFavorites = await this.countTotalFavorites();
    return this.save();
  };

Collection.exists = async function (
  name: string,
  creatorUuid: string
): Promise<boolean> {
  return (await Collection.findOne({ where: { name, creatorUuid } })) !== null;
};

Collection.getOrCreateCollection = function (
  name: string,
  description: string,
  creatorUuid: string
): Promise<[CollectionModel, boolean]> {
  return Collection.findOrCreate({
    where: {
      creatorUuid,
      name,
    },
    defaults: {
      creatorUuid,
      description: description || "",
      name,
    },
  });
};

export interface CollectionJSON {
  id: number;
  name: string;
  description: string;
  images: ImageJSON[] | undefined;
  totalFavorites: number;
  builds: BuildJSON[] | undefined;
  creator: UserJSON | undefined;
}

Collection.prototype.toJSON = async function (
  user: UserModel = null
): Promise<CollectionJSON> {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    images: this.images
      ? await Promise.all(this.images.map((image) => image.toJSON()))
      : undefined,
    totalFavorites: this.totalFavorites,
    builds: this.builds
      ? await Build.toJSONArray(this.builds, user)
      : undefined,
    creator: this.creator ? await this.creator.toJSON() : undefined,
  };
};

export { Collection };
