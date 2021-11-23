const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Tag = sequelize.define("tag", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});

Tag.getOrCreateTags = function (tags) {

}

module.exports = { Tag };
