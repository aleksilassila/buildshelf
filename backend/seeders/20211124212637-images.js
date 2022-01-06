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

    fs.copyFile("./images/1.jpg", "./uploads/1.jpg", logError);
    fs.copyFile("./images/2.jpg", "./uploads/2.jpg", logError);
    fs.copyFile("./images/3.jpg", "./uploads/3.jpg", logError);
    fs.copyFile("./images/4.jpg", "./uploads/4.jpg", logError);
    fs.copyFile("./images/5.jpg", "./uploads/5.jpg", logError);
    fs.copyFile("./images/6.jpg", "./uploads/6.jpg", logError);
    fs.copyFile("./images/7.jpg", "./uploads/7.jpg", logError);
    fs.copyFile("./images/8.jpg", "./uploads/8.jpg", logError);
    fs.copyFile("./images/9.jpg", "./uploads/9.jpg", logError);
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
  }
};
