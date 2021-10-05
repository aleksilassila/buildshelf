const { User } = require("./User");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Favorites = exports.Favorites = sequelize.define("favorites", {
    userId: DataTypes.STRING,
    postId: DataTypes.INTEGER,
});

Favorites.belongsTo(User);
