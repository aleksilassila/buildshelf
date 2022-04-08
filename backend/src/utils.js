const Validator = require("jsonschema").Validator;
const { Op } = require("sequelize");
const { errors } = require("./client-error");
const fs = require("fs");
const { parse, writeUncompressed, simplify } = require("prismarine-nbt");

const validator = new Validator();

/**
 * Returns the basis for a search query options
 * @param query req.query
 * @returns {{offset: number, limit: number, where: {}}}
 */
module.exports.searchQueryBuilder = (query) => {
  const { timespan, offset, amount } = query;

  const where = {};
  let _offset = 0;
  let _amount = 20;

  // Date
  if (timespan) {
    where.createdAt = {
      [Op.gte]: new Date(new Date().getTime() - parseFloat(timespan)),
    };
  }

  if (offset) {
    _offset = parseInt(offset);
  }

  if (amount) {
    _amount = parseInt(amount);
  }

  return {
    where,
    offset: _offset,
    limit: _amount,
  };
};

/**
 * Casts request parameter strings to correct types if possible
 */
const castTypes = (validator) =>
  function (object, key, schema, options, ctx) {
    const value = object[key];
    if (typeof value === "undefined") return;

    // Test if the schema declares a type, but the type keyword fails validation
    if (
      schema.type &&
      validator.attributes.type.call(
        validator,
        value,
        schema,
        options,
        ctx.makeChild(schema, key)
      )
    ) {
      // If the type is "number" but the instance is not a number, cast it
      if (schema.type === "number" && typeof value !== "number") {
        object[key] = parseFloat(value);
      } else if (schema.type === "boolean" && typeof value !== "boolean") {
        object[key] = value === "true" ? true : value === "false" ? false : value;
      }
    }
  };

module.exports.validateBody = (schema) => {
  return function (req, res, next) {
    const validation = validator.validate(req.body, schema, {
      preValidateProperty: castTypes(validator),
    });

    if (validation.valid) {
      next();
    } else {
      console.log(validation.errors);
      console.log(req.body);
      errors.BAD_REQUEST.send(res);
    }
  };
};

module.exports.validateQuery = (schema) => {
  return function (req, res, next) {
    const validation = validator.validate(req.query, schema, {
      preValidateProperty: castTypes(validator),
    });

    if (validation.valid) {
      next();
    } else {
      errors.BAD_REQUEST.send(res);
    }
  };
};

module.exports.parseLitematic = async (filename) => {
  return await parse(await fs.promises.readFile(filename))
    .then((result) => simplify(result.parsed))
    .catch((err) => ({}));
};
