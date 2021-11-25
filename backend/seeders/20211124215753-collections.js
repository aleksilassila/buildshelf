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
          id: 1,
          name: "New Town",
          description: "A beautiful medieval town.",
          ownerId: "06235c6b4fe18ea2949375ade5661823",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Modern City",
          description: "A thriving city filled with skyscrapers.",
          ownerId: "06235c6b4fe18ea2949375ade5661823",
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
