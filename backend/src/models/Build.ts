import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  NOW,
  Op,
} from "sequelize";

import sequelize from "../database";
import { UserJSON, UserModel } from "./User";
import { ImageJSON, ImageModel } from "./Image";
import { CollectionJSON } from "./Collection";
import { TagModel } from "./Tag";
import { BuildFileModel } from "./BuildFile";
import { CategoryModel } from "./Category";
import { BuildDownload, BuildView, UserSavedBuilds } from "./index";

const { Image } = require("./Image");

interface Cache {
  writeThreshold: number;
  addView: (buildId: number) => void;
  addDownload: (buildId: number) => void;
  getViews: (buildId: number) => Date[];
  getDownloads: (buildId: number) => Date[];
  write: (buildId: number) => Promise<BuildModel | void>;
  views: { [buildId: number]: Date[] };
  downloads: { [buildId: number]: Date[] };
}

export const cache: Cache = {
  writeThreshold: 50,
  getViews: (buildId: number) => {
    if (!cache.views[buildId]) {
      cache.views[buildId] = [];
    }

    return cache.views[buildId];
  },
  getDownloads: (buildId: number) => {
    if (!cache.downloads[buildId]) {
      cache.downloads[buildId] = [];
    }

    return cache.downloads[buildId];
  },
  addView: (buildId: number) => {
    const views = cache.getViews(buildId);

    views.push(new Date());
    if (views.length > cache.writeThreshold) cache.write(buildId).then();
  },
  addDownload: (buildId: number) => {
    const downloads = cache.getDownloads(buildId);

    downloads.push(new Date());
    if (downloads.length > cache.writeThreshold) cache.write(buildId).then();
  },
  write: async (buildId) => {
    const views = cache.getViews(buildId);
    const downloads = cache.getDownloads(buildId);
    if (!views && !downloads) return;

    // Lock so values won't be updated twice
    const backup = [views, downloads];
    delete cache.views[buildId];
    delete cache.downloads[buildId];

    const build = await Build.findByPk(buildId).catch(() => undefined);

    if (build) {
      return Promise.all([
        views &&
          BuildView.bulkCreate(views.map((d) => ({ createdAt: d, buildId }))),
        downloads &&
          BuildDownload.bulkCreate(
            downloads.map((d) => ({ createdAt: d, buildId }))
          ),
      ]).then(() => build.updateTotals());
    }

    cache.views[buildId] = backup[0];
    cache.downloads[buildId] = backup[1];
  },
  views: {},
  downloads: {},
};

export interface BuildModel extends BuildAttributes {
  toJSON: (user?: UserModel) => any;
  setImagesById: (imageIds: string[]) => Promise<void>;
  addTag: BelongsToManyAddAssociationMixin<BuildModel, TagModel>;
  updateTotalSaves: () => Promise<BuildModel>;
  getImages: BelongsToManyGetAssociationsMixin<ImageModel>;
  updateScore: () => Promise<BuildModel>;
  addSave: () => void;
  addDownload: () => void;
  addView: () => void;
  updateTotals: () => Promise<BuildModel>;
}

export interface BuildAttributes
  extends Model<
    InferAttributes<BuildAttributes>,
    InferCreationAttributes<BuildAttributes>
  > {
  id?: CreationOptional<number>;
  title: string;
  description: string;
  totalDownloads: CreationOptional<number>;
  totalSaves: CreationOptional<number>;
  totalViews: CreationOptional<number>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
  private: CreationOptional<boolean>;
  approved: CreationOptional<boolean>;
  score: CreationOptional<number>;
  creatorUuid?: string;
  collectionId?: number;
  categoryName?: string;
  buildFileId?: number;
  creator?: CreationOptional<UserModel>;
}

interface BuildStatic extends ModelStatic<BuildModel> {
  toJSONArray: (builds: BuildModel[], user: any) => Promise<BuildJSON[]>;
}

const Build = <BuildStatic>sequelize.define<BuildAttributes>(
  "build",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    totalDownloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalSaves: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // FIXME prod
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { timestamps: false }
);

Build.prototype.setImagesById = async function (imageIds: string[]) {
  return this.setImages(
    await Image.findAll({
      where: { id: { [Op.in]: imageIds?.map((i) => parseInt(i)) } },
    })
  );
};

Build.prototype.hasAccess = function (user: UserModel = null) {
  if (user?.moderator === true) return true;
  if (this.private || !this.approved) {
    if (!user || user?.uuid !== this.creator?.uuid) {
      return false;
    }
  }

  return true;
};

Build.prototype.addView = function () {
  cache.addView(this.id);
};

Build.prototype.addDownload = function () {
  cache.addDownload(this.id);
};

Build.prototype.updateTotals = async function (): Promise<BuildModel> {
  const totalSaves = await sequelize.model("userSavedBuilds").count({
    where: {
      buildId: this.id,
    },
  });
  const totalViews = await BuildView.count({
    where: {
      buildId: this.id,
    },
  });
  const totalDownloads = await BuildDownload.count({
    where: {
      buildId: this.id,
    },
  });

  return this.update({
    totalSaves,
    totalViews,
    totalDownloads,
  });
};

Build.prototype.updateScore = async function () {
  const daysSinceCreation =
    (Date.now() - new Date(this.createdAt).getTime()) / 1000 / 60 / 60 / 24;

  const viewsThisWeek = await BuildView.count({
    where: {
      buildId: this.id,
      createdAt: {
        [Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });
  const savesThisWeek = await UserSavedBuilds.count({
    where: {
      buildId: this.id,
      createdAt: {
        [Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const downloadsThisWeek = await BuildDownload.count({
    where: {
      buildId: this.id,
      createdAt: {
        [Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const freshness = Math.max(
    0,
    Math.min(
      1,
      -(((daysSinceCreation / 7) * (daysSinceCreation / 7)) / 1.7) + 1
    )
  );

  const score =
    freshness *
    (0.2 * viewsThisWeek + 0.8 * (downloadsThisWeek + savesThisWeek));

  return this.update({
    score: Math.round(score),
  });
};

export interface BuildJSON {
  images: ImageJSON[] | undefined;
  creator: UserJSON | undefined;
  private: boolean;
  totalDownloads: number;
  description: string;
  collection: CollectionJSON | undefined;
  title: string;
  tags: TagModel[];
  totalSaves: number;
  createdAt: string;
  buildFile: BuildFileModel;
  approved: boolean;
  isSaved: boolean;
  id: number;
  category: CategoryModel;
  updatedAt: string;
}

Build.prototype.toJSON = async function (
  user: UserModel = null
): Promise<BuildJSON> {
  if (!this.hasAccess(user)) {
    return undefined;
  }

  let isSaved = user
    ? !!(
        await user.getSavedBuilds({
          attributes: ["id"],
          where: { id: this.id },
        })
      )?.length
    : undefined;

  return {
    id: this.id,
    title: this.title,
    description: this.description,
    buildFile: await this.getBuildFile(),
    images: await Promise.all((await this.getImages()).map((i) => i.toJSON())),
    totalDownloads: this.totalDownloads,
    totalSaves: this.totalSaves,
    creator: this.creator ? await this.creator.toJSON() : undefined,
    category: await this.getCategory(),
    tags: await this.getTags(),
    collection: this.collection ? await this.collection.toJSON() : undefined,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    private: this.private,
    ...(!!user?.moderator && { approved: this.approved }),
    isSaved,
  };
};

Build.toJSONArray = function (
  builds: BuildModel[],
  user: any = null
): Promise<BuildJSON[]> {
  return Promise.all(builds.map((b) => b.toJSON(user))).then((res) =>
    res.filter((i) => i !== undefined)
  );
};

export { Build };
