const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const User = exports.User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    remoteId: DataTypes.STRING,
    uuid: DataTypes.STRING,
});