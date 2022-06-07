"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "userSavedBuilds",
      [
        {
          userUuid: "f2cc1eadd681243467e4e11476c27df2",
          buildId: 99991,
          createdAt: new Date(),
        },
        {
          userUuid: "f2cc1eadd681243467e4e11476c27df2",
          buildId: 99992,
          createdAt: new Date(),
        },
        {
          userUuid: "f2cc1eadd681243467e4e11476c27df2",
          buildId: 99993,
          createdAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkUpdate(
      "builds",
      {
        totalSaves: 1,
      },
      { id: [99991, 99992, 99993] }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "userSavedBuilds",
      {
        userUuid: "f2cc1eadd681243467e4e11476c27df2",
        buildId: [99991, 99992, 99993],
      },
      {}
    );
  },
};
