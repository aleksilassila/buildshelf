import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NOW,
  Op,
} from "sequelize";

import sequelize from "../database";
import User, { UserJSON } from "./User";
import Image, { ImageJSON } from "./Image";
import Collection, { CollectionJSON } from "./Collection";
import { TagModel } from "./Tag";
import { BuildFileModel } from "./BuildFile";
import { CategoryModel } from "./Category";
import { BuildDownload, BuildView, UserSavedBuilds } from "./index";
import PostBase from "./PostBase";

export interface BuildJSON {
  images: ImageJSON[] | undefined;
  creator: UserJSON | undefined;
  private: boolean;
  totalDownloads: number;
  description: string;
  collection: CollectionJSON | undefined;
  name: string;
  tags: TagModel[];
  totalSaves: number;
  createdAt: Date;
  buildFile: BuildFileModel;
  approved: boolean;
  isSaved: boolean;
  id: number;
  category: CategoryModel;
  updatedAt: Date;
}

interface Cache {
  writeThreshold: number;
  addView: (buildId: number) => void;
  addDownload: (buildId: number) => void;
  getViews: (buildId: number) => Date[];
  getDownloads: (buildId: number) => Date[];
  write: (buildId: number) => Promise<Build | void>;
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

class Build extends PostBase<
  InferAttributes<Build>,
  InferCreationAttributes<Build>
> {
  declare totalDownloads: CreationOptional<number>;
  declare totalSaves: CreationOptional<number>;

  declare collectionId?: number;
  declare categoryName?: string;
  declare buildFileId?: number;

  declare collection?: CreationOptional<Collection>;
  declare buildFile?: CreationOptional<BuildFileModel>;

  declare addTag: BelongsToManyAddAssociationMixin<Build, TagModel>;
  declare getImages: BelongsToManyGetAssociationsMixin<Image>;
  declare setImages: BelongsToManySetAssociationsMixin<Build, Image>;
  declare getBuildFile: BelongsToGetAssociationMixin<BuildFileModel>;
  declare getCategory: BelongsToGetAssociationMixin<CategoryModel>;
  declare getTags: BelongsToManyGetAssociationsMixin<TagModel>;

  async toJSON(user: User = null): Promise<BuildJSON> {
    if (!this.canView(user)) {
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
      name: this.name,
      description: this.description,
      buildFile: await this.getBuildFile(),
      images: await Promise.all(
        (await this.getImages()).map((i) => i.toJSON())
      ),
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
  }

  async setImagesById(imageIds: string[]) {
    return this.setImages(
      await Image.findAll({
        where: { id: { [Op.in]: imageIds?.map((i) => parseInt(i)) } },
      })
    );
  }

  addView() {
    cache.addView(this.id);
  }

  addDownload() {
    cache.addDownload(this.id);
  }

  async updateTotals(): Promise<Build> {
    const totalSaves = await UserSavedBuilds.count({
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
  }

  async updateScore() {
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
  }

  static toJSONArray(builds: Build[], user: any = null): Promise<BuildJSON[]> {
    return Promise.all(builds.map((b) => b.toJSON(user))).then((res) =>
      res.filter((i) => i !== undefined)
    );
  }
}

Build.init(
  {
    ...PostBase.getCommonAttributes(),
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
  },
  { timestamps: false, sequelize, modelName: "build" }
);

export default Build;
