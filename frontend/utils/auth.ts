import { useEffect, useState } from "react";

interface StoredUserData {
  username?: string;
  token?: string;
  uuid?: string;
  iat?: number;
}

export interface LocalUser extends StoredUserData {
  isLoggedIn: (uuid?: string) => boolean;
}

export const getLocalUser = (): StoredUserData => {
  let userObject;

  try {
    userObject = JSON.parse(window.localStorage.getItem("user")) || {};
  } catch {
    userObject = {};
  }

  return userObject;
};

export const useLocalUser = (): LocalUser => {
  const [userObject, setUserObject] = useState({
    isLoggedIn: function (uuid = undefined) {
      return !!this?.token && (!uuid || this.uuid === uuid);
    },
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(window.localStorage.getItem("user")) || {};

      setUserObject({
        ...userObject,
        ...storedUser,
      });
    } catch (ignored) {}
  }, []);

  return userObject;
};

export const storeLocalUser = function (userObject: LocalUser) {
  window.localStorage.setItem(
    "user",
    JSON.stringify(
      userObject === null
        ? null
        : {
            username: userObject.username,
            token: userObject.token,
            uuid: userObject.uuid,
            iat: userObject.iat,
          }
    )
  );
};
