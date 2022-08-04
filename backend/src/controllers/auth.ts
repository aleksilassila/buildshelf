import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../models";
import { ClientError, errors } from "../client-error";
import { NextFunction, Response } from "express";
import { OptionalAuthReq } from "../../types";

const moderatorAuth = async function (
  req: OptionalAuthReq,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.user.moderator) {
    // Make it seem like route does not exist
    // res.status(403).send("Unauthenticated");
  } else {
    next();
  }
};

const auth = async function (
  req: OptionalAuthReq,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    res.status(403).send("Unauthenticated");
  } else {
    next();
  }
};

const optionalAuth = async function (
  req: OptionalAuthReq,
  res: Response,
  next: NextFunction
) {
  const token = req.query.token;

  if (!token) {
    next();
    return;
  }

  const [user, decodeError] = await User.getUserWithToken(token?.toString());

  if (!decodeError) {
    if (user) {
      req.user = user;
    }
    next();
  } else {
    res.status(404).send("User not found.");
  }
};

// const loginMojang = async function (req, res) {
//   const { username, password, clientToken } = req.body;
//
//   if (!username || !password) {
//     res
//       .status(400)
//       .send(
//         "Bad request | You need to provide username, password and client token."
//       );
//     return;
//   }
//
//   const payload: any = {
//     agent: {
//       name: "Minecraft",
//       version: 1,
//     },
//     username,
//     password,
//     requestUser: true,
//   };
//
//   if (clientToken) {
//     payload.clientToken = clientToken;
//   }
//
//   const response = await axios
//     .post("https://authserver.mojang.com/authenticate", payload)
//     .catch((err) => err.response);
//   const user = response?.data?.user;
//   const profile = response?.data?.selectedProfile;
//
//   if (response?.status === 200 && user && profile) {
//     const localUser = await User.findOrCreateUser(
//       profile.id,
//       user.id,
//       profile.name
//     );
//
//     res.send(localUser.getSignedToken());
//   } else {
//     res.status(403).send("Invalid credentials");
//   }
// };

const loginMicrosoft = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).send("Bad request | You need to provide code.");
    return;
  }

  const msResponse = await axios
    .post(
      "https://login.live.com/oauth20_token.srf",
      new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.FRONTEND_ENDPOINT + "/login",
      })
    )
    .catch((err) => err.response);

  if (msResponse?.status !== 200) {
    // ClientError.sendInternalError(new Error(JSON.stringify(msResponse)), res);
    errors.SERVER_ERROR.send(res);
    return;
  }

  const {
    access_token: msAccessToken,
    refresh_token: msRefreshToken,
    expires_in: msExpiresIn,
  } = msResponse.data;
  // console.log("MS response", msResponse.data);

  const xblResponse = await axios
    .post(
      "https://user.auth.xboxlive.com/user/authenticate",
      {
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${msAccessToken}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => err.response);

  if (xblResponse?.status !== 200) {
    // ClientError.sendInternalError(new Error(JSON.stringify(xblResponse)), res);
    errors.SERVER_ERROR.send(res);
    return;
  }

  const { Token: xblAccessToken } = xblResponse.data;
  const xblUserHash = xblResponse.data?.DisplayClaims?.xui[0]?.uhs;
  // console.log("XBL response", xblResponse.data);

  const xstsResponse = await axios
    .post(
      "https://xsts.auth.xboxlive.com/xsts/authorize",
      {
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [xblAccessToken],
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => err.response);

  if (xstsResponse?.status !== 200) {
    // ClientError.sendInternalError(new Error(JSON.stringify(xstsResponse)), res);
    errors.SERVER_ERROR.send(res);
    return;
  }

  const { Token: xstsAccessToken } = xstsResponse.data;
  const xstsUserHash = xstsResponse.data?.DisplayClaims?.xui[0]?.uhs;
  // console.log("XSTS response", xstsResponse.data);

  const minecraftApiResponse = await axios
    .post(
      "https://api.minecraftservices.com/authentication/login_with_xbox",
      {
        identityToken: `XBL3.0 x=${xstsUserHash};${xstsAccessToken}`,
      },
      {}
    )
    .catch((err) => err.response);

  if (minecraftApiResponse?.status !== 200) {
    // ClientError.sendInternalError(
    //   new Error(JSON.stringify(minecraftApiResponse)),
    //   res
    // );
    errors.SERVER_ERROR.send(res);
    return;
  }

  const { access_token: minecraftAccessToken } = minecraftApiResponse.data;

  const minecraftProfileResponse = await axios
    .get("https://api.minecraftservices.com/minecraft/profile", {
      headers: {
        Authorization: `Bearer ${minecraftAccessToken}`,
      },
    })
    .catch((err) => err.response);

  if (minecraftProfileResponse?.status !== 200) {
    // ClientError.sendInternalError(
    //   new Error(JSON.stringify(minecraftProfileResponse)),
    //   res
    // );
    errors.SERVER_ERROR.send(res);
    return;
  }

  const { name: username, id: uuid } = minecraftProfileResponse.data;

  console.log("Minecraft profile", uuid, minecraftAccessToken);
  const localUser = await User.findOrCreateUser(uuid, uuid, username);

  if (localUser) {
    res.send(localUser.getSignedToken());
  } else {
    res.status(403).send("Invalid credentials");
  }
};

const loginClient = async (req, res) => {
  const { accessToken } = req.body;

  // Validate if accessToken and uuid combination is valid
  const response = await axios
    .get("https://api.minecraftservices.com/minecraft/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((err) => err.response);

  if (response.status !== 200 || !response?.data?.id || !response?.data?.name) {
    errors.UNAUTHORIZED.send(res);
    return;
  }

  const localUser = await User.findOrCreateUser(
    response.data.id,
    response.data.id,
    response.data.name
  );

  res.send(localUser.getSignedToken());
};

export { moderatorAuth, auth, optionalAuth, loginMicrosoft, loginClient };
