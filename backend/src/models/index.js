const { Category } = require("./Category");
const { User } = require("./User");
const { Build } = require("./Build");

User.belongsToMany(Build, { through: 'favorites', as: 'favorite' });
Build.belongsToMany(User, { through: 'favorites', as: 'favorite' });

User.hasOne(Build, { as: 'creator' });
Build.belongsTo(User)

User.belongsToMany(Build, { through: 'saves', as: 'save' });
Build.belongsToMany(User, { through: 'saves', as: 'save' });

Category.hasOne(Category, { as: "parent"});

module.exports = {
    Build,
    User,
    Category,
}
