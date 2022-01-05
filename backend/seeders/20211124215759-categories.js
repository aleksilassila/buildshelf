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

    const categories = ["houses", "decorations", "castles", "bases", "traps", "xp-farms",
      "temples", "statues", "redstone", "pixel-art", "boats", "megabuilds", "floating-islands",
      "spawns", "tree", "world-prefab", "nether-portals", "bridges", "other"];

    await queryInterface.bulkInsert('categories', categories.map(category => {
      return { name: category };
    }), {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('categories', null, {});
  }
};
