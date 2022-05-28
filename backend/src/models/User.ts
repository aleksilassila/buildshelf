import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToManyHasAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  CreationOptional,
} from "sequelize";
import sequelize from "../database";
import fs from "fs";
import { BuildModel, BuildJSON } from "./Build";
import { ImageModel } from "./Image";

export interface UserModel extends UserAttributes {
  toJSON(): UserJSON;
  purgeImages: () => Promise<void>;
  hasFollow: BelongsToManyHasAssociationMixin<UserAttributes, UserAttributes>;
  getSavedBuilds: BelongsToManyGetAssociationsMixin<BuildModel>;
  getImages: BelongsToManyGetAssociationsMixin<ImageModel>;
}

interface UserAttributes
  extends Model<
    InferAttributes<UserAttributes>,
    InferCreationAttributes<UserAttributes>
  > {
  username: string;
  uuid: string;
  moderator: CreationOptional<boolean>;
  remoteId: string;
}

const User = sequelize.define<UserAttributes>("user", {
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
    defaultValue: true, // FIXME prod
    allowNull: false,
  },
});

export interface UserJSON {
  saves: BuildJSON[] | undefined;
  following: boolean | undefined;
  moderator?: boolean;
  follows: UserJSON[] | undefined;
  uuid: string;
  username: string;
}

User.prototype.toJSON = async function (
  currentUser: UserModel = null
): Promise<UserJSON> {
  return {
    username: this.username,
    uuid: this.uuid,
    saves: this.savedBuilds
      ? await Promise.all(this.savedBuilds.map((b) => b.toJSON()))
      : undefined,
    follows: this.follows
      ? await Promise.all(this.follows.map((u) => u.toJSON()))
      : undefined,
    following: currentUser ? await currentUser.hasFollow(this.uuid) : undefined,
    ...(currentUser?.moderator && { moderator: this.moderator }),
  };
};

User.prototype.purgeImages = async function (): Promise<any> {
  const images = await this.getImages();

  return Promise.all(
    images.map(async (image) => {
      if ((await image.getBuilds())?.length === 0) {
        fs.unlink(image.getPath(), () => {});
        return image.destroy();
      }
    })
  );
};

export { User };
