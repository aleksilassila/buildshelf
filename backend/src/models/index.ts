import sequelize from "../database";
import Collection from "./Collection";
import { Tag } from "./Tag";
import { Category } from "./Category";
import User from "./User";
import Build from "./Build";
import Image from "./Image";
import { BuildFile } from "./BuildFile";
import { DataTypes, NOW } from "sequelize";

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

const BuildSave = sequelize.define(
  "buildSaves",
  {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
  },
  {
    timestamps: false,
  }
);

const UserFavoriteCollections = sequelize.define(
  "userFavoriteCollections",
  {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
  },
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

const CollectionImages = sequelize.define(
  "collectionImages",
  {},
  { timestamps: false }
);

// Other empty models
const BuildView = sequelize.define(
  "buildView",
  {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
  },
  { timestamps: false }
);
const BuildDownload = sequelize.define(
  "buildDownload",
  {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
  },
  { timestamps: false }
);

User.belongsToMany(Build, {
  through: BuildSave,
  as: "savedBuilds",
});

Build.hasMany(BuildView);
BuildView.belongsTo(Build);

User.hasMany(BuildView, { as: "views", foreignKey: "viewerUuid" });
BuildView.belongsTo(User, { as: "viewer", foreignKey: "viewerUuid" });

Build.hasMany(BuildDownload);
BuildDownload.belongsTo(Build);

User.hasMany(BuildDownload, { as: "downloads", foreignKey: "downloaderUuid" });
BuildDownload.belongsTo(User, {
  as: "downloader",
  foreignKey: "downloaderUuid",
});

User.hasMany(Build, { as: "builds", foreignKey: "creatorUuid" });
Build.belongsTo(User, { as: "creator", foreignKey: "creatorUuid" });

User.belongsToMany(Build, { through: UserBookmarks, as: "bookmarks" });

Collection.hasMany(Build);
Build.belongsTo(Collection);

Image.belongsToMany(Collection, {
  through: CollectionImages,
  as: "collections",
});

Collection.belongsToMany(Image, {
  through: CollectionImages,
  as: "images",
});

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

User.belongsToMany(Collection, {
  through: UserFavoriteCollections,
  as: "favoriteCollections",
});
Collection.belongsToMany(User, {
  through: UserFavoriteCollections,
  as: "favoriteCollections",
});

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

export {
  Build,
  User,
  Tag,
  Collection,
  Category,
  Image,
  BuildFile,
  BuildView,
  BuildDownload,
  BuildSave,
  UserFavoriteCollections,
};
