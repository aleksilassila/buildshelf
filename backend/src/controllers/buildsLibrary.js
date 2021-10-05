const State = require("../lib/State");
const { Favorites } = require("../models/Favorites");
const { Posts } = require("../models/Posts");

exports.upload = function (req, res) {
    if (req.files?.buildFile === undefined) {
        res.status(400).send('Bad request')
        return;
    }

    const buildFile = req.files?.buildFile[0];
    const { description, title } = req.body;

    if (!buildFile || !title) {
        res.status(400).send("Bad request");
        return;
    }

    const images = [];

    for (const image of (req.files?.images || [])) {
        images.push(image.filename);
    }

    const values = {
        title,
        buildFile: buildFile.filename,
        description,
        images,
    }

    Posts.create(values);

    res.send("File created");
}

exports.getNew = async function (req, res) {
    const { postIndex } = req.body;
    const amount = req.body.amount || 20;

    if (postIndex === undefined || amount > 120) {
        res.status(400).send("Bad request");
        return;
    }

    const { rows } = await Posts.findAndCountAll({
        order: [[ 'createdAt', 'DESC' ]],
        offset: postIndex,
        limit: amount
    });

    res.send(rows);
}

exports.getTop = async function (req, res) {
    const posts = [];
    const { timespan } = req.query.timespan ? req.query : { timespan: 'day' };

    console.log(timespan, State.topPosts[timespan])
    if (!State.topPosts[timespan]?.length) {
        res.status(500).send('Internal error');
        return;
    }

    for (const post of State.topPosts[timespan]) {
        posts.push({
            title: post.title,
            description: post.description,
            images: post.images,
            buildFile: post.buildFile,
            downloads: post.downloads,
        });
    }

    res.send(posts);
}

exports.get = async function (req, res) {
    const { post: postId } = req.params;

    const post = await Posts.findOne({
        where: {
            id: postId,
        }
    });

    if (!post) {
        res.status(404).send('Post not found')
        return;
    }

    const favorites = await Favorites.count({
        where: {
            postId,
        }
    })

    res.send({
        title: post.title,
        description: post.description,
        buildFile: post.buildFile,
        images: post.images,
        downloads: post.downloads,
        favorites,
    });
}

exports.favorite = async function (req, res) {
    const user = req.user;
    const { post: postId } = req.params;
    const liked = req.query.liked === 'true';
    console.log(user);

    if (postId === null) {
        res.status(400).send('Bad request');
        return;
    }

    const post = await Posts.findOne({
        where: {
            id: postId,
        }
    });

    if (!post) {
        res.status(404).send('Post not found');
        return;
    }

    if (liked) {
        await Favorites.findOrCreate({
            where: {
                postId,
                userId: user.id,
            },
            defaults: {
                postId,
                userId: user.id,
            }
        });
    } else {
        await Favorites.destroy({
            where: {
                postId,
                userId: user.id,
            }
        })
    }

    res.status(200).send(liked ?
        'Post added to favorites' :
        'Post removed from favorites');
}

exports.download = function (req, res) {

}

exports.search = function (req, res) {

}


