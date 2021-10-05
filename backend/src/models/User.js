const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const User = exports.User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    uuid: DataTypes.STRING,
});
