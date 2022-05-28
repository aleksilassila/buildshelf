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

interface CategoryStatic extends ModelStatic<CategoryAttributes> {
  getOrCreateCategory(
    categoryString: string
  ): Promise<[CategoryAttributes, boolean]>;
}

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

Category.getOrCreateCategory = async function (
  categoryString: string
): Promise<[CategoryAttributes, boolean]> {
  categoryString = categoryString?.toLowerCase();
  const parts = categoryString.split("/");

  for (let i = 1; i < parts.length; i++) {
    const name = parts.slice(0, i).join("/");
    await Category.findOrCreate({
      where: { name },
      defaults: { name },
    });
  }

  return Category.findOrCreate({
    where: {
      name: categoryString,
    },
    defaults: {
      name: categoryString,
    },
  });
};

export { Category };
