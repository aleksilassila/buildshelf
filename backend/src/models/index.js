const { sequelize } = require("../database");
const { Collection } = require("./Collection");
const { Tag } = require("./Tag");
const { Category } = require("./Category");
const { User } = require("./User");
const { Build } = require("./Build");
const { Image } = require("./Image");
const { BuildFile } = require("./BuildFile");
const { DataTypes } = require("sequelize");

// Define empty junction tables
const UserBookmarks = sequelize.define(
  "userBookmarks",
  {},
  {
    timestamps: false,
  }
);

const BuildTags = sequelize.define(
  "buildTags",
  {},
  {
    timestamps: false,
  }
);

const UserCollectionBookmarks = sequelize.define(
  "userCollectionBookmarks",
  {},
  {
    timestamps: false,
  }
);

const UserSavedBuilds = sequelize.define(
  "userSavedBuilds",
  {},
  {
    timestamps: false,
  }
);

const BuildImages = sequelize.define("buildImages", {}, { timestamps: false });

const UserFollows = sequelize.define(
  "userFollows",
  {
    followerUuid: DataTypes.STRING,
    followedUuid: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
);

User.belongsToMany(Build, {
  through: UserSavedBuilds,
  as: "savedBuilds",
});

User.hasMany(Build, { as: "builds", foreignKey: "creatorUuid" });
Build.belongsTo(User, { as: "creator", foreignKey: "creatorUuid" });

User.belongsToMany(Build, { through: UserBookmarks, as: "bookmarks" });

Collection.hasMany(Build);
Build.belongsTo(Collection);

User.hasMany(Collection, { as: "collections", foreignKey: "creatorUuid" });
Collection.belongsTo(User, { as: "creator", foreignKey: "creatorUuid" });

Category.hasMany(Build, { as: "category" });
Build.belongsTo(Category, { as: "category" });

// Category.hasMany(Collection, { as: "category"});
// Collection.belongsTo(Category, { as: "category"});

Build.belongsToMany(Tag, { through: BuildTags });
Tag.belongsToMany(Build, { through: BuildTags });

User.belongsToMany(User, {
  through: UserFollows,
  as: "follows",
  foreignKey: "followerUuid",
  otherKey: "followedUuid",
});

// User.belongsToMany(Collection, { through: "userFavoriteCollections", as: "favoriteCollections" });
// Collection.belongsToMany(User, { through: "userFavoriteCollections", as: "favoriteCollections" });
User.belongsToMany(Collection, {
  through: UserCollectionBookmarks,
  as: "collectionBookmarks",
});

// Files
Image.belongsToMany(Build, {
  through: BuildImages,
  as: "builds",
});

Build.belongsToMany(Image, {
  through: BuildImages,
  as: "images",
});

User.hasMany(Image, { as: "images", foreignKey: "creatorUuid" });
Image.belongsTo(User, { as: "creator", foreignKey: "creatorUuid" });

Build.belongsTo(BuildFile, {
  as: "buildFile",
  foreignKey: "buildFileId",
});
BuildFile.hasOne(Build, {
  as: "build",
  foreignKey: "buildFileId",
});

User.hasMany(BuildFile, { as: "buildFile", foreignKey: "creatorUuid" });
BuildFile.belongsTo(User, { as: "creator", foreignKey: "creatorUuid" });

module.exports = {
  Build,
  User,
  Tag,
  Collection,
  Category,
};
