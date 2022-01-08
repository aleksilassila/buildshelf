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

    const metadata = JSON.stringify({
      version: 5,
      minecraftDataVersion: 2578,
      enclosingSize: {
        x: 10,
        y: 15,
        z: 20,
      },
      blockCount: 300,
    });

    await queryInterface.bulkInsert('builds',
      [
        {
          id: 99991,
          title: "Starter house",
          description: "A beautiful medieval starter house.",
          buildFile: "4.jpg",
          images: ["1.jpg", "2.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99992,
          title: "Skyscraper",
          description: "Description",
          buildFile: "4.jpg",
          images: ["2.jpg", "3.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9999,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99993,
          title: "Cartwheel",
          description: "Description",
          buildFile: "4.jpg",
          images: ["3.jpg", "4.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99994,
          title: "Scarecrow",
          description: "Description",
          buildFile: "4.jpg",
          images: ["4.jpg", "5.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99995,
          title: "Starter house",
          description: "A beautiful medieval starter house.",
          buildFile: "4.jpg",
          images: ["5.jpg", "6.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99996,
          title: "Skyscraper",
          description: "Description",
          buildFile: "4.jpg",
          images: ["6.jpg", "7.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9999,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99997,
          title: "Cartwheel",
          description: "Description",
          buildFile: "4.jpg",
          images: ["7.jpg", "8.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99998,
          title: "Scarecrow",
          description: "Description",
          buildFile: "4.jpg",
          images: ["8.jpg", "9.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99999,
          title: "Starter house",
          description: "A beautiful medieval starter house.",
          buildFile: "4.jpg",
          images: ["9.jpg", "1.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99910,
          title: "Skyscraper",
          description: "Description",
          buildFile: "4.jpg",
          images: ["2.jpg", "3.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9999,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99911,
          title: "Cartwheel",
          description: "Description",
          buildFile: "4.jpg",
          images: ["3.jpg", "4.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
        },
        {
          id: 99912,
          title: "Scarecrow",
          description: "Description",
          buildFile: "4.jpg",
          images: ["4.jpg", "5.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
          metadata,
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

    await queryInterface.bulkDelete('builds', {
      creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
    }, {});
  }
};
