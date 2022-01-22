'use strict';

const fs = require("fs");

const logError = (err) => {
  if (err) {
    console.log("Error occurred", err);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (!fs.existsSync("./uploads")){
        fs.mkdirSync("./uploads");
    }

    fs.copyFile("./seedFiles/1.jpg", "./uploads/1.jpg", logError);
    fs.copyFile("./seedFiles/2.jpg", "./uploads/2.jpg", logError);
    fs.copyFile("./seedFiles/3.jpg", "./uploads/3.jpg", logError);
    fs.copyFile("./seedFiles/4.jpg", "./uploads/4.jpg", logError);
    fs.copyFile("./seedFiles/5.jpg", "./uploads/5.jpg", logError);
    fs.copyFile("./seedFiles/6.jpg", "./uploads/6.jpg", logError);
    fs.copyFile("./seedFiles/7.jpg", "./uploads/7.jpg", logError);
    fs.copyFile("./seedFiles/8.jpg", "./uploads/8.jpg", logError);
    fs.copyFile("./seedFiles/9.jpg", "./uploads/9.jpg", logError);
    fs.copyFile("./seedFiles/1.litematic", "./uploads/1.litematic", logError);
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
  }
};
