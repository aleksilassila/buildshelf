import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
} from "sequelize";
import sequelize from "../database";

export interface CategoryModel extends CategoryAttributes {}

export interface CategoryAttributes
  extends Model<
    InferAttributes<CategoryAttributes>,
    InferCreationAttributes<CategoryAttributes>
  > {
  name: string;
}

interface CategoryStatic extends ModelStatic<CategoryAttributes> {}

const Category = <CategoryStatic>sequelize.define<CategoryAttributes>(
  "category",
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

export { Category };
