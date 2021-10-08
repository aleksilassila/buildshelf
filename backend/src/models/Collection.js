const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Collection = exports.Collection = sequelize.define("collection", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    description: DataTypes.STRING,
});
