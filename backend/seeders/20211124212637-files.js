"use strict";

const fs = require("fs");

const logError = (err) => {
  if (err) {
    console.log("Error occurred", err);
  }
};

const spruceFiles = {
  cart: { category: "decorations", name: "Cart" },
  "cart-big": { category: "decorations", name: "Big Cart" },
  gate: { category: "decorations", name: "Spruce Gate" },
  well: { category: "decorations", name: "Well" },
  stall: { category: "decorations", name: "Spruce Stand" },
  "gate-big": { category: "gates", name: "Big Spruce Gate" },
  "spruce-tree-tall": { category: "trees", name: "Tall Spruce Tree" },
  "spruce-tree-short": { category: "trees", name: "Short Spruce Tree" },
  "house-tiny": { category: "houses", name: "Tiny Stone House" },
  "house-medium-1": { category: "houses", name: "Medium Spruce House" },
  "house-medium-2": { category: "houses", name: "Medium Spruce House" },
  church: { category: "houses", name: "Spruce Church" },
  stable: { category: "houses", name: "Spruce Stable" },
};

const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    Object.keys(spruceFiles).map((fileName) => {
      fs.copyFile(
        "./seedFiles/spruce-village/" + fileName + ".litematic",
        "./uploads/" + fileName + ".litematic",
        logError
      );
      fs.copyFile(
        "./seedFiles/spruce-village/" + fileName + ".jpeg",
        "./uploads/" + fileName + ".jpeg",
        logError
      );
    });

    await queryInterface.bulkInsert(
      "images",
      Object.keys(spruceFiles).map((fileName, index) => {
        return {
          id: index + 1,
          filename: fileName + ".jpeg",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
      {}
    );

    await queryInterface.bulkInsert(
      "buildFiles",
      Object.keys(spruceFiles).map((fileName, index) => ({
        id: index + 1,
        filename: fileName + ".litematic",
        version: 5,
        minecraftDataVersion: 2578,
        x: 22,
        y: 8,
        z: 17,
        blockCount: 1128,
        md5: "02b80e13d8c4437bf6b9d20d5b978459",
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  down: async (queryInterface, Sequelize) => {
    fs.unlinkSync("./uploads/1.jpg");
    fs.unlinkSync("./uploads/2.jpg");
    fs.unlinkSync("./uploads/3.jpg");
    fs.unlinkSync("./uploads/4.jpg");
    fs.unlinkSync("./uploads/5.jpg");
    fs.unlinkSync("./uploads/6.jpg");
    fs.unlinkSync("./uploads/7.jpg");
    fs.unlinkSync("./uploads/8.jpg");
    fs.unlinkSync("./uploads/9.jpg");
    fs.unlinkSync("./uploads/1.litematic");

    await queryInterface.bulkDelete("images", null, {});
    await queryInterface.bulkDelete("buildFiles", null, {});
  },
};
