import { Association, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../database";
import { BuildJSON } from "./Build";
import User, { UserJSON } from "./User";
import Image, { ImageJSON } from "./Image";
import { Build, UserFavoriteCollections } from "./index";
import PostBase from "./PostBase";

export interface CollectionJSON {
  id: number;
  name: string;
  description: string;
  images: ImageJSON[] | undefined;
  totalFavorites: number;
  builds: BuildJSON[] | undefined;
  creator: UserJSON | undefined;
  isFavorite: boolean;
}

class Collection extends PostBase<Collection> {
  declare totalFavorites: CreationOptional<number>;

  declare creatorUuid?: string;

  declare images?: CreationOptional<Image[]>;
  declare creator?: CreationOptional<User>;
  declare builds?: CreationOptional<Build[]>;

  declare static associations: {
    images: Association<Collection, Image>;
    creator: Association<Collection, User>;
    builds: Association<Collection, Build>;
  };

  countTotalFavorites(): Promise<number> {
    return UserFavoriteCollections.count({
      where: {
        collectionId: this.id,
      },
    });
  }

  async updateTotalFavorites(): Promise<Collection> {
    this.totalFavorites = await this.countTotalFavorites();
    return this.save();
  }

  async toJSON(user: User = null): Promise<CollectionJSON> {
    let isFavorite = user
      ? !!(
          await user.getFavoriteCollections({
            attributes: ["id"],
            where: { id: this.id },
          })
        )?.length
      : undefined;

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
      isFavorite,
    };
  }
}

Collection.init(
  {
    ...PostBase.getCommonAttributes(),
    totalFavorites: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "collection",
  }
);

export default Collection;
