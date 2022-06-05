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
      "collections",
      [
        {
          id: 99998,
          name: "New Town",
          description: "A beautiful medieval town.",
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99999,
          name: "Modern City",
          description: "A thriving city filled with skyscrapers.",
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("collections", null, {});
  },
};
