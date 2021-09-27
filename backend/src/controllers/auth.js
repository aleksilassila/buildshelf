const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../models/User");

exports.auth = function (req, res, next) {
    const token = req.query.token;

    const decoded = verifyToken(token);

    if (decoded) {
        console.log("Authenticated: ", decoded.username)
        next();
    } else {
        res.status(403).send("Unauthenticated");
    }
}

exports.login = async function (req, res) {
    const { username, password, clientToken } = req.body;

    if (!username || !password || !clientToken) {
        res.status(400).send("Bad request");
        return;
    }

    const payload = {
        agent: {
            name: "Minecraft",
            version: 1
        },
        username,
        password,
        clientToken,
        requestUser: true
    };

    const response = await axios.post('https://authserver.mojang.com/authenticate', payload).catch(err => err.response);
    const user = response?.data?.user;

    if (response?.status === 200 && user) {
        await User.findOrCreate({
            where: { username: user.username },
            defaults: {
                username: user.username,
                uuid: "Test",
            }
        });

        res.send(signToken(user))
    } else {
        res.status(403).send("Invalid credentials");
    }
}

const signToken = function(payload) {
    return jwt.sign(payload, 'secret')
}

const verifyToken = function(token) {
    return jwt.verify(token, 'secret', function (err, decoded) {
        return err ? false : decoded;
    })
}