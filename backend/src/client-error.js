const errors = require("./constants/errors");

const ClientError = (module.exports = function (code, status, info) {
  this.code = code || errors.USER_ERROR;
  this.status = status || 400;
  this.info = info || "";
});

ClientError.prototype = Object.create(Error.prototype);
ClientError.prototype.toString = function () {
  const obj = Object(this);
  if (obj !== this) {
    throw new TypeError();
  }

  return `Error ${this.code}: ${this.status} ${this.info}`;
};

module.exports.middleware = async (req, res, next) => {
  try {
    await next();
  } catch (err) {
    await next(err)
    if (err instanceof ClientError) {
      res.body = {
        status: err.status,
        userMessage: err.code,
        errorCode: err.code,
        moreInfo: err.info,
      };
      res.status = err.status;
    } else {
      res.status =
        err.status && Number.isInteger(err.status) ? err.status : 500;
      res.body = {
        status: err.status && Number.isInteger(err.status) ? err.status : 500,
        userMessage: "Internal server error",
        errorCode: errors.SERVER_ERROR,
        moreInfo: "",
      };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(err);
    }
  }
};
