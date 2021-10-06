const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Build = exports.Build = sequelize.define("build", {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    buildFile: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.STRING),
    downloads: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    totalFavorites: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});
