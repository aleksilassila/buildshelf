const { Sequelize } = require("sequelize");
const config = require("./config");

exports.sequelize = new Sequelize(config.DB_URL);
