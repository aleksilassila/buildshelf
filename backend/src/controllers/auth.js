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

exports.loginMojang = async function (req, res) {
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
    const [localUser] = await getDBUser(profile.id, profile.name, user.id);

    res.send(
      signToken(localUser.username, localUser.uuid)
    );
  } else {
    res.status(403).send("Invalid credentials");
  }
};

exports.loginMicrosoft = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).send("Bad request | You need to provide code.");
    return;
  }

  const msResponse = await axios
    .post("https://login.live.com/oauth20_token.srf", new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
    }))
    .catch((err) => err.response);

  if (msResponse?.status !== 200) {
    res.status(500).send("Error occurred during Microsoft authentication.");
    return;
  }

  const { access_token: msAccessToken, refresh_token: msRefreshToken, expires_in: msExpiresIn } = msResponse.data;
  console.log("MS response", msResponse.data);

  const xblResponse = await axios
    .post("https://user.auth.xboxlive.com/user/authenticate", {
      Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${msAccessToken}`,
      },
      RelyingParty: "http://auth.xboxlive.com",
      TokenType: "JWT"
    }, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .catch((err) => err.response);

  if (xblResponse?.status !== 200) {
    res.status(500).send("Error occurred during Xbox Live authentication.");
    return;
  }

  const { Token: xblAccessToken } = xblResponse.data;
  const xblUserHash = xblResponse.data?.DisplayClaims?.xui[0]?.uhs;
  console.log("XBL response", xblResponse.data);

  const xstsResponse = await axios
    .post("https://xsts.auth.xboxlive.com/xsts/authorize", {
      Properties: {
          SandboxId: "RETAIL",
          UserTokens: [
              xblAccessToken,
          ]
      },
      "RelyingParty": "rp://api.minecraftservices.com/",
      "TokenType": "JWT"
    }, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .catch((err) => err.response);

  if (xstsResponse?.status !== 200) {
    res.status(500).send("Error occurred during Xbox Live authentication.");
    return;
  }

  const { Token: xstsAccessToken } = xstsResponse.data;
  const xstsUserHash = xstsResponse.data?.DisplayClaims?.xui[0]?.uhs;
  console.log("XSTS response", xstsResponse.data);

  const minecraftApiResponse = await axios
    .post("https://api.minecraftservices.com/authentication/login_with_xbox", {
      identityToken: `XBL3.0 x=${xstsUserHash};${xstsAccessToken}`,
      }, {})
      .catch((err) => err.response);

  if (minecraftApiResponse?.status !== 200) {
    res.status(500).send("Error occurred during Minecraft authentication.");
    return;
  }

  const { access_token: minecraftAccessToken } = minecraftApiResponse.data;

  const minecraftProfileResponse = await axios
    .get("https://api.minecraftservices.com/minecraft/profile", {
      headers: {
        "Authorization": `Bearer ${minecraftAccessToken}`,
      }
    })
    .catch((err) => err.response);

  if (minecraftProfileResponse?.status !== 200) {
    res.status(500).send("Could not get Minecraft profile.");
    return;
  }

  const { name: username, id: uuid, id: remoteId} = minecraftProfileResponse.data;

  const localUser = await getDBUser(uuid, username, remoteId);

  if (localUser) {
    res.send(
      signToken(localUser.username, localUser.uuid)
    );
  } else {
    res.status(403).send("Invalid credentials");
  }
}

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

const getDBUser = async (uuid, defaultUsername, defaultRemoteId) => {
  const [localUser] = await User.findOrCreate({
      where: { uuid },
      defaults: {
        username: defaultUsername,
        remoteId: defaultRemoteId,
        uuid,
      },
    }).catch(err => [undefined]);

  return localUser;
};

const signToken = function (username, uuid) {
  return jwt.sign({username, uuid}, "secret");
};

const verifyToken = function (token) {
  return jwt.verify(token, "secret", function (err, decoded) {
    return err ? false : decoded;
  });
};
