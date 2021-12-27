'use strict';

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
    await queryInterface.bulkInsert('collections',
      [
        {
          id: 9998,
          name: "New Town",
          description: "A beautiful medieval town.",
          ownerId: "f2cc1eadd681243467e4e11476c27df2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9999,
          name: "Modern City",
          description: "A thriving city filled with skyscrapers.",
          ownerId: "f2cc1eadd681243467e4e11476c27df2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('collections', null, {});
  }
};
