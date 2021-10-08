const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Tag = exports.Tag = sequelize.define("tag", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});
