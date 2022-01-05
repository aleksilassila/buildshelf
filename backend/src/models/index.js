const { sequelize } = require("../database");
const { Collection } = require("./Collection");
const { Tag } = require("./Tag");
const { Category } = require("./Category");
const { User } = require("./User");
const { Build } = require("./Build");
const { UserFollows } = require("./junctions/UserFollows");

// Define empty junction tables
const UserSaves = sequelize.define("userSaves", {}, {
  timestamps: false,
});

const BuildTags = sequelize.define("buildTags", {}, {
  timestamps: false,
});

const UserFavoriteCollections = sequelize.define("userFavoriteCollections", {}, {
  timestamps: false,
});

const UserFavoriteBuilds = sequelize.define("userFavoriteBuilds", {}, {
  timestamps: false,
});

// User.belongsToMany(Build, { through: "userFavorites", as: "favorites" });
// Build.belongsToMany(User, { through: "userFavoriteBuilds", as: "favoriteBuilds" });
User.belongsToMany(Build, {
  through: UserFavoriteBuilds,
  as: "favoriteBuilds",
});

User.hasMany(Build, { as: "builds", foreignKey: "creatorUuid" });
Build.belongsTo(User, { as: "creator", foreignKey: "creatorUuid" });

User.belongsToMany(Build, { through: UserSaves, as: "saves" });

Collection.hasMany(Build);
Build.belongsTo(Collection);

User.hasMany(Collection);
Collection.belongsTo(User);

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
  through: UserFavoriteCollections,
  as: "favoriteCollections",
});

module.exports = {
  Build,
  User,
  Tag,
  Collection,
  Category,
};
