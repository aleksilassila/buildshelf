export default {
  collections: {
    get: {
      search: "/collections/search",
      get: "/collections/:collectionId",
    },
    post: {
      create: "/collections",
      favorite: "/collections/:collectionId/favorite",
    },
    delete: {
      delete: "/collections/:collectionId",
    },
    put: {
      update: "/collections/:collectionId",
    },
  },
  users: {
    get: {
      get: "/users/:uuid",
      saves: "/users/:uuid/saves",
      bookmarks: "/users/:uuid/bookmarks",
      feed: "/feed",
    },
    post: {
      follow: "/users/:uuid/follow",
    },
  },
  builds: {
    get: {
      download: "/builds/:buildId/download",
      get: "/builds/:buildId",
      search: "/builds/search",
    },
    post: {
      create: "/builds",
      save: "/builds/:buildId/save",
      bookmark: "/builds/:buildId/bookmark",
      approve: "/builds/:buildId/approve",
      uploadImages: "/images/upload",
    },
    put: { update: "/builds/:buildId" },
    delete: { delete: "/builds/:buildId" },
  },
};
