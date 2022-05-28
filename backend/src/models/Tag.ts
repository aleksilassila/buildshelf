import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
} from "sequelize";
import sequelize from "../database";

export interface TagModel extends TagAttributes {}

export interface TagAttributes
  extends Model<
    InferAttributes<TagAttributes>,
    InferCreationAttributes<TagAttributes>
  > {
  name: string;
}

interface TagStatic extends ModelStatic<TagAttributes> {}

const Tag = <TagStatic>sequelize.define<TagAttributes>(
  "tag",
  {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

export { Tag };
