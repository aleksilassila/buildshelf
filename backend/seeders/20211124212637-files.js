"use strict";

const fs = require("fs");

const logError = (err) => {
  if (err) {
    console.log("Error occurred", err);
  }
};

const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    imageNumbers.forEach((imageNumber) => {
      fs.copyFile(
        "./seedFiles/" + imageNumber + ".jpg",
        "./uploads/" + imageNumber + ".jpg",
        logError
      );
    });

    fs.copyFile("./seedFiles/1.litematic", "./uploads/1.litematic", logError);

    await queryInterface.bulkInsert(
      "images",
      imageNumbers.map((imageNumber) => {
        return {
          id: 99990 + imageNumber,
          filename: imageNumber + ".jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
      {}
    );

    await queryInterface.bulkInsert(
      "buildFiles",
      [
        {
          id: 99991,
          filename: "1.litematic",
          version: 5,
          minecraftDataVersion: 2578,
          x: 22,
          y: 8,
          z: 17,
          blockCount: 1128,
          md5: "02b80e13d8c4437bf6b9d20d5b978459",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
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
