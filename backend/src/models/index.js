const { Collection } = require("./Collection");
const { Tag } = require("./Tag");
const { Category } = require("./Category");
const { User } = require("./User");
const { Build } = require("./Build");

User.belongsToMany(Build, { through: 'userFavorites', as: 'favorites' });
Build.belongsToMany(User, { through: 'userFavorites', as: 'favorites' });

User.hasOne(Build, { as: 'creator', foreignKey: 'creatorId' });
Build.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' })

User.belongsToMany(Build, { through: 'userSaves', as: 'saves' });
Build.belongsToMany(User, { through: 'userSaves', as: 'saves' });

Collection.hasMany(Build);
Build.belongsTo(Collection);

User.hasMany(Collection, { as: 'owner', foreignKey: 'ownerId' });
Collection.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

Category.hasMany(Build, { as: 'category' });
Build.belongsTo(Category, { as: 'category' });

Build.belongsToMany(Tag, { through: 'postTags' });
Tag.belongsToMany(Build, { through: 'postTags', as: 'tags' });

module.exports = {
    Build,
    User,
    Tag,
    Collection,
    Category,
}
