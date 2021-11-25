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

    await queryInterface.bulkInsert('builds',
      [
        {
          id: 1,
          title: "Starter house",
          description: "A beautiful medieval starter house.",
          buildFile: "4.jpg",
          images: ["1.jpg", "2.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "06235c6b4fe18ea2949375ade5661823",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 2,
          title: "Skyscraper",
          description: "Description",
          buildFile: "4.jpg",
          images: ["2.jpg", "3.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "06235c6b4fe18ea2949375ade5661823",
          collectionId: 2,
          categoryName: "houses",
        },
        {
          id: 3,
          title: "Cartwheel",
          description: "Description",
          buildFile: "4.jpg",
          images: ["3.jpg", "4.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "06235c6b4fe18ea2949375ade5661823",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 4,
          title: "Scarecrow",
          description: "Description",
          buildFile: "4.jpg",
          images: ["4.jpg", "5.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "06235c6b4fe18ea2949375ade5661823",
          collectionId: 1,
          categoryName: "houses",
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

    await queryInterface.bulkDelete('builds', null, {});
  }
};
