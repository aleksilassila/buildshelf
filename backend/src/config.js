module.exports = {
  ENDPOINT: process.env.ENDPOINT || "http://localhost:9000/api",
  DB_URL: process.env.DB_URL || "postgres://post:post@db/post",
  UPLOAD_DIRECTORY: "./uploads",
  NODE_ENV: process.env.NODE_ENV || "development",
};
