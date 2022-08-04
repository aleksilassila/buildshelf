import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../database";
import fs from "fs";
import Build, { BuildJSON } from "./Build";
import Image from "./Image";
import Collection from "./Collection";
import jwt from "jsonwebtoken";

export interface UserJSON {
  saves: BuildJSON[] | undefined;
  following: boolean | undefined;
  moderator?: boolean;
  follows: UserJSON[] | undefined;
  uuid: string;
  username: string;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare username: string;
  declare uuid: string;
  declare moderator: CreationOptional<boolean>;
  declare remoteId: string;

  declare savedBuilds?: NonAttribute<Build[]>;
  follows?: NonAttribute<User[]>;

  async toJSON(currentUser: User = null): Promise<UserJSON> {
    return {
      username: this.username,
      uuid: this.uuid,
      saves: this.savedBuilds
        ? await Promise.all(this.savedBuilds.map((b) => b.toJSON()))
        : undefined,
      follows: this.follows
        ? await Promise.all(this.follows.map((u) => u.toJSON()))
        : undefined,
      following: currentUser ? await currentUser.hasFollow(this) : undefined,
      ...(currentUser?.moderator && { moderator: this.moderator }),
    };
  }
  async purgeImages(): Promise<any> {
    const images = await this.getImages();

    return Promise.all(
      images.map(async (image) => {
        if ((await image.getBuilds())?.length === 0) {
          fs.unlink(image.getPath(), () => {});
          return image.destroy();
        }
      })
    );
  }

  hasFollow: BelongsToManyHasAssociationMixin<User, User>;
  getSavedBuilds: BelongsToManyGetAssociationsMixin<Build>;
  getImages: BelongsToManyGetAssociationsMixin<Image>;
  hasSavedBuild: BelongsToManyHasAssociationMixin<User, Build>;
  addSavedBuild: BelongsToManyAddAssociationMixin<User, Build>;
  removeSavedBuild: BelongsToManyRemoveAssociationMixin<User, Build>;
  hasBookmark: BelongsToManyHasAssociationMixin<User, Build>;
  addBookmark: BelongsToManyAddAssociationMixin<User, Build>;
  getBookmarks: BelongsToManyGetAssociationsMixin<Build>;
  removeBookmark: BelongsToManyRemoveAssociationMixin<User, Build>;
  getFollows: BelongsToManyGetAssociationsMixin<User>;
  addFavoriteCollection: BelongsToManyAddAssociationMixin<User, Collection>;
  removeFavoriteCollection: BelongsToManyRemoveAssociationMixin<
    User,
    Collection
  >;
  hasFavoriteCollection: BelongsToManyHasAssociationMixin<User, Collection>;
  getFavoriteCollections: BelongsToManyGetAssociationsMixin<Collection>;

  static async findOrCreateUser(
    uuid: string,
    remoteId: string,
    username: string
  ): Promise<User | undefined> {
    const [user, created] = await User.findOrCreate({
      where: { uuid },
      defaults: {
        username,
        remoteId,
        uuid,
      },
    }).catch((err) => [undefined]);

    return user;
  }

  getSignedToken() {
    return jwt.sign(
      { username: this.username, uuid: this.uuid },
      "tbTybk6KnhcD"
    );
  }

  static async getUserWithToken(
    token: string
  ): Promise<[user: User | undefined, decodeError: boolean]> {
    const decoded = jwt.verify(token, "tbTybk6KnhcD", function (err, decoded) {
      return err ? undefined : decoded;
    });

    if (decoded) {
      return [await User.findByPk(decoded.uuid).catch(() => undefined), false];
    } else {
      return [undefined, true];
    }
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    remoteId: DataTypes.UUID,
    moderator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

export default User;
