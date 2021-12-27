const { Category } = require("../models/index");
exports.getCategories = async function (req, res) {
    res.send(await Category.findAll({
        limit: 50,
    }));
};
