const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const fs = require("fs");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  remoteId: DataTypes.UUID,
  moderator: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // FIXME prod
    allowNull: false,
  },
});

User.prototype.toJSON = async function (currentUser = null) {
  return {
    username: this.username,
    uuid: this.uuid,
    saves: this.savedBuilds
      ? await Promise.all(this.savedBuilds.map((b) => b.toJSON()))
      : undefined,
    follows: this.follows
      ? await Promise.all(this.follows.map((u) => u.toJSON()))
      : undefined,
    following: currentUser ? await currentUser.hasFollow(this.uuid) : undefined,
    ...(currentUser?.moderator && { moderator: this.moderator }),
  };
};

User.prototype.purgeImages = async function () {
  const images = await this.getImages();

  return Promise.all(
    images.map(async (image) => {
      if ((await image.getBuilds())?.length === 0) {
        fs.unlink(image.getPath(), () => {});
        return image.destroy();
      }
    })
  );
};

module.exports = { User };
