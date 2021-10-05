const { Op } = require("sequelize");
const { Posts } = require("../models/Posts");

class Tasks {
    static generateTopPosts = async function (time) {
        const t = new Date(new Date().getTime()/1000 - time/1000);

        const allPosts = await Posts.findAll({
            where: {
                createdAt: {
                    [Op.gte]: t,
                }
            },
            order: [[ 'createdAt', 'DESC' ]],
        });

        return allPosts;
    }

    static generateHotPosts = function () {

    }
}

module.exports = Tasks;