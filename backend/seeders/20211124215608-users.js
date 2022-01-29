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

    await queryInterface.bulkInsert('users', [{
      username: 'jeb_',
      remoteId: "06235c6b4fe18ea2949375ade5661823",
      uuid: "f2cc1eadd681243467e4e11476c27df2",
      createdAt: new Date(),
      updatedAt: new Date(),
      moderator: false,
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    queryInterface.bulkDelete('users', {
      uuid: "f2cc1eadd681243467e4e11476c27df2",
    }, {});
  }
};
