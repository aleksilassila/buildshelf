import {
  CreationOptional,
  DataTypes,
  Includeable,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  NOW,
  Op,
} from "sequelize";
import User from "./User";
import { removeUndefined } from "../utils";
import { OptionalAuthReq } from "../../types";
import { Request } from "express";

class PostBase<T extends Model> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T>
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

  static search<TT extends Model>(
    this: ModelStatic<TT>,
    options: {
      where: { [key: string]: any };
      order;
      include: Includeable[];
    },
    req: OptionalAuthReq<Request<{}, {}, {}, any>>
  ): Promise<TT[]> {
    const { name, creatorUuid, timespan, approved, offset, amount } = req.query;

    return this.findAll({
      // @ts-ignore
      where: {
        ...removeUndefined({
          ...options.where,
          creatorUuid,
          name: {
            [Op.iLike]: name ? "%" + name + "%" : undefined,
          },
        }),
        ...(parseFloat(timespan) && {
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - parseFloat(timespan)),
          },
        }),
        ...(req.user?.moderator && approved !== undefined
          ? { approved: approved }
          : { approved: true }),
        ...(req.user?.moderator && req.query.private !== undefined
          ? { private: req.query.private }
          : { private: false }),
      },
      offset: offset || 0,
      limit: amount || 20,
      order: options.order || [["createdAt", "DESC"]],
      include: options.include,
    });
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
