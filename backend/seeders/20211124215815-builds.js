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
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
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
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
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
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
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
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 5,
          title: "Starter house",
          description: "A beautiful medieval starter house.",
          buildFile: "4.jpg",
          images: ["5.jpg", "6.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 6,
          title: "Skyscraper",
          description: "Description",
          buildFile: "4.jpg",
          images: ["6.jpg", "7.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 2,
          categoryName: "houses",
        },
        {
          id: 7,
          title: "Cartwheel",
          description: "Description",
          buildFile: "4.jpg",
          images: ["7.jpg", "8.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 8,
          title: "Scarecrow",
          description: "Description",
          buildFile: "4.jpg",
          images: ["8.jpg", "9.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 9,
          title: "Starter house",
          description: "A beautiful medieval starter house.",
          buildFile: "4.jpg",
          images: ["9.jpg", "1.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 10,
          title: "Skyscraper",
          description: "Description",
          buildFile: "4.jpg",
          images: ["2.jpg", "3.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 2,
          categoryName: "houses",
        },
        {
          id: 11,
          title: "Cartwheel",
          description: "Description",
          buildFile: "4.jpg",
          images: ["3.jpg", "4.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 1,
          categoryName: "houses",
        },
        {
          id: 12,
          title: "Scarecrow",
          description: "Description",
          buildFile: "4.jpg",
          images: ["4.jpg", "5.jpg"],
          downloads: 100,
          totalFavorites: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorId: "f2cc1eadd681243467e4e11476c27df2",
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
