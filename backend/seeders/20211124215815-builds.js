"use strict";

// 49fb0ab6-2177-49b8-a35f-7b16736cf480
const spruceDesc = `
A Building created by MythicalSausage @ youtube.com/watch?v=bClClR9ZkzQ&
`;

const spruceFiles = {
  cart: { category: "decorations", name: "Cart" },
  "cart-big": { category: "decorations", name: "Big Cart" },
  gate: { category: "decorations", name: "Spruce Gate" },
  well: { category: "decorations", name: "Well" },
  stall: { category: "decorations", name: "Spruce Stand" },
  "gate-big": { category: "gates", name: "Big Spruce Gate" },
  "spruce-tree-tall": { category: "trees", name: "Tall Spruce Tree" },
  "spruce-tree-short": { category: "trees", name: "Short Spruce Tree" },
  "house-tiny": { category: "houses", name: "Tiny Stone House" },
  "house-medium-1": { category: "houses", name: "Medium Spruce House" },
  "house-medium-2": { category: "houses", name: "Medium Spruce House" },
  church: { category: "houses", name: "Spruce Church" },
  stable: { category: "houses", name: "Spruce Stable" },
};

const oakDesc = `
A build created by Zhevenn @ youtube.com/watch?v=pv2MoQJpuKI&
`;

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

    const spruceEntries = Object.keys(spruceFiles).map((fileName, index) => ({
      id: index + 1,
      name: spruceFiles[fileName].name,
      description: spruceDesc,
      buildFileId: index + 1,
      totalDownloads: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorUuid: "49fb0ab6217749b8a35f7b16736cf480",
      collectionId: null,
      categoryName: spruceFiles[fileName].category,
      approved: true,
      private: false,
      score: 0,
    }));
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete(
      "builds",
      {
        creatorUuid: "49fb0ab6217749b8a35f7b16736cf480",
      },
      {}
    );
  },
};
