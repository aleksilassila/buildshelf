require("dotenv").config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const UPLOAD_DIRECTORY = "./uploads";

export const FRONTEND_ENDPOINT =
  process.env.FRONTEND_ENDPOINT || "http://localhost:3000";
export const ENDPOINT =
  process.env.BACKEND_ENDPOINT || "http://localhost:9000/api";
export const DB_URL = process.env.DB_URL || "postgres://post:post@db/post";

export const MICROSOFT_CLIENT_SECRET =
  process.env.MICROSOFT_CLIENT_SECRET || "";
export const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || "";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
