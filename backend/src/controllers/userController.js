const { User, Build, Collection } = require("../models/index");

exports.getUser = async function (req, res) {
    const { uuid } = req.params;

    const user = await User.findOne({
        where: {
            uuid,
        },
        include: 'favorites',
    });

    if (!user) {
        res.status(404).send('User not found')
        return;
    }

    res.send(user);
}

exports.getUserBuilds = async function (req, res) {
    const { uuid } = req.params;

    const user = await User.findOne({
        where: {
            uuid,
        },
    });

    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    const builds = await Build.findAll({
        where: {
            creatorId: uuid,
        },
        order: [['createdAt', 'DESC']],
    });

    res.send({
        username: user.username,
        builds,
    });
}

exports.getUserFavorites = async function (req, res) {
    const { uuid } = req.params;

    const user = await User.findOne({
        where: {
            uuid,
        },
    });

    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    res.send(await Promise.all((await user.getFavorites()).map(build => build.toJSON())));
}

exports.getUserSaves = async function (req, res) {
    const { uuid } = req.params;

    if (uuid !== req.user.uuid) {
        res.status(401).send("Unauthorized");
        return;
    }

    const user = await User.findOne({
        where: {
            uuid,
        },
    });

    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    res.send(await Promise.all((await user.getSaves()).map(build => build.toJSON())));
}

exports.getProfile = async function (req, res) {
    const { uuid } = req.params;

    const profileObject = {

    };

    if (uuid === req.user?.id) {
        const user = await User.findOne({
            where: {
                uuid,
            },
            include: 'saved',
        });
    } else {

    }

    res.send(profileObject);
}

exports.getUserCollections = async function (req, res) {
    const { userId } = req.params;

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
