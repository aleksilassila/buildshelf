const { User, Build, Collection } = require("../models/index");

exports.getUser = async function (req, res) {
    const { userId } = req.params;

    const user = await User.findOne({
        where: {
            id: userId,
        },
        include: 'saved',
    });

    if (!user) {
        res.status(404).send('User not found')
        return;
    }

    res.send(user);
}

exports.getUserBuilds = async function (req, res) {
    const { userId } = req.params;

    const user = await User.findOne({
        where: {
            id: userId,
        },
    });

    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    const builds = await Build.findAll({
        where: {
            creatorId: userId,
        },
        order: [['createdAt', 'DESC']],
    });

    res.send({
        username: user.username,
        builds,
    });
}

exports.getUserFavorites = async function (req, res) {
    const { userId } = req.params;

    const user = await User.findOne({
        where: {
            id: userId,
        },
        include: {
            model: Build,
            as: 'favorite',
            order: [['createdAt', 'DESC']],
        }
    });

    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    res.send({
        username: user.username,
        favorites: user.favorite,
    });
}

exports.getUserSaves = async function (req, res) {
    const { userId } = req.params;

    const user = await User.findOne({
        where: {
            id: userId,
        },
        include: {
            model: Build,
            as: 'save',
            order: [['createdAt', 'DESC']],
        }
    });

    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    res.send({
        username: user.username,
        saves: user.save,
    });
}

exports.getProfile = async function (req, res) {
    const { userId } = req.params;

    const profileObject = {

    };

    if (userId === req.user?.id) {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: 'saved',
        });
    } else {

    }

    res.send(profileObject);
}

exports.getUserCollections = async function (req, res) {
    const { userId } = req.params;

    console.log("Params", req.params)

    if (!userId) {
        res.status(400).send("User id not found.");
        return;
    }

    res.send(await Collection.findAll({
        where: {
            ownerId: userId,
        }
    }));
}
