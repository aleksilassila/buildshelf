const { Posts } = require("../models/Posts");

exports.upload = function (req, res) {
    const buildFile = req.files?.buildFile[0];
    const { description, title } = req.body;

    if (!buildFile || !title) {
        res.status(400).send("Bad request");
        return;
    }

    const values = {
        title,
        buildFile: buildFile.filename,
        description,
        images: [],
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
        order: [ [ 'createdAt', 'DESC' ]],
        offset: postIndex,
        limit: amount
    });

    res.send(rows);
}

exports.search = function (req, res) {

}


