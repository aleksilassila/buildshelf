export interface UserObject {
  username: string;
  token: string;
  uuid: string;
  iat: number;
  isLoggedIn: () => boolean;
}

class Auth {
  /**
   * Get user object if logged in.
   * @return UserObject or null
   */
  static getUser = function (): UserObject {
    let userObject;

    try {
      userObject = JSON.parse(window.localStorage.getItem("user"));
    } catch {
      userObject = {};
    }

    userObject.isLoggedIn = () => {
      return !!userObject.token;
    };

    return userObject;
  };

  static setUser = function (userObject: UserObject) {
    window.localStorage.setItem("user", JSON.stringify(userObject));
  };
}

export default Auth;
