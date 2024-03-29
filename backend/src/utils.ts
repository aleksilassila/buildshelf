import { Validator } from "jsonschema";
import { Op } from "sequelize";
import { errors } from "./client-error";
import fs from "fs";
import { parse, simplify, writeUncompressed } from "prismarine-nbt";
import sharp from "sharp";

const validator = new Validator();

interface SearchWhere {
  createdAt?: any;
}

const removeUndefined = (object) => {
  const out = {};

  for (const key of Object.keys(object)) {
    if (typeof object[key] === "object") {
      out[key] = object[key];
      for (const ikey of Object.getOwnPropertySymbols(object[key])) {
        if (object[key][ikey] === undefined || object[key][ikey] === "") {
          delete out[key];
        }
      }
    } else if (object[key] !== undefined) {
      out[key] = object[key];
    }
  }

  return out;
};

/**
 * Returns the basis for a search query options
 * @param query req.query
 * @returns {{offset: number, limit: number, where: {}}}
 */
const searchQueryBuilder = (query) => {
  const { timespan, offset, amount } = query;

  const where: SearchWhere = {};
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
        object[key] =
          value === "true" ? true : value === "false" ? false : value;
      }
    }
  };

const validateBody = (schema) => {
  return function (req, res, next) {
    const validation = validator.validate(req.body, schema, {
      preValidateProperty: castTypes(validator),
    });

    if (validation.valid) {
      next();
    } else {
      errors.BAD_REQUEST.send(res);
    }
  };
};

const validateQuery = (schema) => {
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

const parseSimplifiedLitematic = async (filename) => {
  return await parse(await fs.promises.readFile(filename))
    .then((result) => simplify(result.parsed))
    .catch((err) => ({}));
};

const parseLitematic = async (filename) => {
  return await parse(await fs.promises.readFile(filename)).catch(
    (err) => undefined
  );
};

const writeLitematic = async (filename, nbtData): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, writeUncompressed(nbtData), () => resolve());
  });
};

const compressImage = async (filePath: string) => {
  const newFilePath = filePath.substr(0, filePath.lastIndexOf(".")) + ".jpeg";
  const buffer = await sharp(filePath)
    .resize({
      width: 1920,
      height: 1080,
      fit: "inside",
    })
    .jpeg({ quality: 50 })
    .toBuffer();
  await sharp(buffer).toFile(newFilePath);
  if (filePath !== newFilePath) {
    fs.unlinkSync(filePath);
  }
};

export {
  searchQueryBuilder,
  validateBody,
  validateQuery,
  parseSimplifiedLitematic,
  parseLitematic,
  writeLitematic,
  removeUndefined,
  compressImage,
};
