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

    // array from 99990 to 99999
    const ids = [
      99990, 99991, 99992, 99993, 99994, 99995, 99996, 99997, 99998, 99999,
    ];

    // array from 99991 to 99999
    const imageIds = [
      99991, 99992, 99993, 99994, 99995, 99996, 99997, 99998, 99999,
    ];
    // Assign every build 2 images
    await queryInterface.bulkInsert(
      "buildImages",
      [
        ...ids.map((id) => ({
          buildId: id,
          imageId: imageIds[Math.floor(Math.random() * imageIds.length)],
        })),
        {
          buildId: 99990,
          imageId: 99999,
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "collectionImages",
      [
        {
          collectionId: 99998,
          imageId: 99999,
        },
        {
          collectionId: 99999,
          imageId: 99998,
        },
        {
          collectionId: 99999,
          imageId: 99997,
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
     */
    await queryInterface.bulkDelete("buildImages", null, {});
    await queryInterface.bulkDelete("collectionImages", null, {});
  },
};
