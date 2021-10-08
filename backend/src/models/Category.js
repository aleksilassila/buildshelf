const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Category = sequelize.define("category", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});

Category.getCategory = async (categoryString) => {
    const parts = categoryString.split("/");

    for (let i = 1; i < parts.length; i++) {
        const name = parts.slice(0, i).join("/");
        await Category.findOrCreate({
            where: { name },
            defaults: { name },
        });
    }

    return await Category.create({
        name: categoryString,
    })
}

module.exports = { Category };
