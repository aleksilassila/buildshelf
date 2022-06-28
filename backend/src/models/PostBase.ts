import {
  CreationOptional,
  DataTypes,
  Model,
  ModelAttributes,
  NOW,
} from "sequelize";
import User from "./User";

class PostBase<Attributes, CreationAttributes> extends Model<
  Attributes,
  CreationAttributes
> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare totalViews: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare private: CreationOptional<boolean>;
  declare approved: CreationOptional<boolean>;
  declare score: CreationOptional<number>;

  declare creatorUuid?: string;

  declare creator?: CreationOptional<User>;

  canEdit(user: User = null) {
    if (user?.moderator === true) return true;
    return user?.uuid === this.creatorUuid;
  }

  canView(user: User = null) {
    if (user?.moderator === true) return true;
    if (this.private || !this.approved) {
      if (!user || user?.uuid !== this.creator?.uuid) {
        return false;
      }
    }

    return true;
  }

  static getCommonAttributes() {
    return {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      totalViews: {
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
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    };
  }
}

export default PostBase;
