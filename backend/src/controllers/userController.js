const { User } = require("../models/index");

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