const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../models/index");
const { errors } = require("../client-error");

exports.moderatorAuth = async function (req, res, next) {
  if (!req.user || !req.user.moderator) {
    // Make it seem like route does not exist
    // res.status(403).send("Unauthenticated");
  } else {
    next();
  }
}

exports.auth = async function (req, res, next) {
  if (!req.user) {
    res.status(403).send("Unauthenticated");
  } else {
    next();
  }
};

exports.optionalAuth = async function (req, res, next) {
  const token = req.query.token;

  if (!token) {
    next();
    return;
  }

  const decoded = verifyToken(token);

  if (decoded) {
    const user = await User.findOne({
      where: {
        uuid: decoded.uuid,
      },
    });

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send("User not found.");
    }
  } else {
    next();
  }
};

exports.login = async function (req, res) {
  const { username, password, clientToken } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .send(
        "Bad request | You need to provide username, password and client token."
      );
    return;
  }

  const payload = {
    agent: {
      name: "Minecraft",
      version: 1,
    },
    username,
    password,
    requestUser: true,
  };

  if (clientToken) {
    payload.clientToken = clientToken;
  }

  const response = await axios
    .post("https://authserver.mojang.com/authenticate", payload)
    .catch((err) => err.response);
  const user = response?.data?.user;
  const profile = response?.data?.selectedProfile;

  if (response?.status === 200 && user && profile) {
    const [localUser] = await User.findOrCreate({
      where: { uuid: profile.id },
      defaults: {
        username: profile.name,
        remoteId: user.id,
        uuid: profile.id,
      },
    });

    res.send(
      signToken(localUser.username, localUser.uuid)
    );
  } else {
    res.status(403).send("Invalid credentials");
  }
};

exports.loginClient = async (req, res) => {
  const { accessToken } = req.body;
  const uuid = req.body.uuid?.replace("-", "");

  // Validate if accessToken and uuid combination is valid
  const response = await axios
    .post("https://sessionserver.mojang.com/session/minecraft/join", {
      accessToken,
      selectedProfile: uuid,
    })
    .catch((err) => err.response);

  if (response.status !== 204) {
    errors.UNAUTHORIZED.send(res);
    return;
  }

  const username = await axios
    .get("https://sessionserver.mojang.com/session/minecraft/profile/" + uuid)
    .then((res) => res.data?.name)
    .catch((err) => {});

  if (!username) {
    errors.SERVER_ERROR.send(res);
    return;
  }

  const [localUser] = await User.findOrCreate({
    where: { uuid },
    defaults: {
      username,
      uuid,
    },
  });

  res.send(signToken(localUser.username, localUser.uuid));
};

const signToken = function (username, uuid) {
  return jwt.sign({username, uuid}, "secret");
};

const verifyToken = function (token) {
  return jwt.verify(token, "secret", function (err, decoded) {
    return err ? false : decoded;
  });
};
