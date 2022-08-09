import { Sequelize } from "sequelize";
import { DB_URL } from "./config";

export default new Sequelize(DB_URL, { logging: false });
