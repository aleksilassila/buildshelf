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
    await queryInterface.bulkInsert('userFavorites',
      [
        {
          userUuid: "f2cc1eadd681243467e4e11476c27df2",
          buildId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userUuid: "f2cc1eadd681243467e4e11476c27df2",
          buildId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userUuid: "f2cc1eadd681243467e4e11476c27df2",
          buildId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});

    await queryInterface.bulkUpdate('builds', {
        totalFavorites: 1,
    }, { id: [2, 3, 4] });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('userFavorites', {
        userUuid: "f2cc1eadd681243467e4e11476c27df2",
        buildId: [2, 3, 4]
    }, {});
  }
};
