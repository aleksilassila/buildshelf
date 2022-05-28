import { Sequelize } from "sequelize";
import config from "./config";

export default new Sequelize(config.DB_URL, { logging: false });
