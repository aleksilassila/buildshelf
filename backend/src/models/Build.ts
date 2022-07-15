import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
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
import PostBase, { Cache } from "./PostBase";

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
  categoryName: string;
  updatedAt: Date;
}

class BuildCache extends Cache<Build> {
  async write(
    field: "views" | "downloads" | "favorites",
    id: number
  ): Promise<void | Build> {
    const build = await Build.findByPk(id).catch(() => undefined);

    const views = this.get("views", id);
    const downloads = this.get("downloads", id);

    if (build) {
      return Promise.all([
        views &&
          BuildView.bulkCreate(
            views.map((view) => ({
              createdAt: view.date,
              buildId: id,
              viewerUuid: view.uuid,
            }))
          ),
        downloads &&
          BuildDownload.bulkCreate(
            downloads.map((download) => ({
              createdAt: download.date,
              buildId: id,
              downloaderUuid: download.uuid,
            }))
          ),
      ]).then(() => build.updateTotals());
    }
  }

  async writeAll(): Promise<void> {
    const buildIds = [
      ...Object.keys(this.data.views),
      ...Object.keys(this.data.downloads),
    ];

    return Promise.all(
      buildIds.map((id) =>
        Promise.all([
          this.write("views", Number(id)),
          this.write("downloads", Number(id)),
        ])
      )
    ).then(() => undefined);
  }
}

class Build extends PostBase<Build> {
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
      categoryName: await this.getCategory().then((c) => c?.name),
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

  addView(uuid: string = undefined) {
    Build.cache.increment("views", this.id, uuid);
  }

  addDownload(uuid: string) {
    Build.cache.increment("downloads", this.id, uuid);
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

  static cache = new BuildCache();
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
