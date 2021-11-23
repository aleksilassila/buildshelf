const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Collection = sequelize.define("collection", {
    name: {
        type: DataTypes.STRING,
    },
    description: DataTypes.STRING,
});

Collection.exists = function (name, ownerId) {
    return Collection.findOne({ where: { name, ownerId }}) !== null;
}

Collection.getOrCreateCollection = function (name, description, ownerId) {
    return Collection.findOrCreate({
        where: {
            ownerId,
            name,
        },
        defaults: {
            ownerId,
            description: description || "",
            name,
        }
    });
}

module.exports = { Collection }
