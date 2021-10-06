const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Category = exports.Category = sequelize.define("category", {
    name: DataTypes.STRING,
});
