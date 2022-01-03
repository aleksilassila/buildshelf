export interface UserObject {
  username: string;
  token: string;
  uuid: string;
  iat: number;
}

class Auth {
  /**
   * Get user object if logged in.
   * @return UserObject or null
   */
  static getUser = function (): UserObject {
    try {
      return JSON.parse(window.localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  static setUser = function (userObject: UserObject) {
    window.localStorage.setItem("user", JSON.stringify(userObject));
  };
}

export default Auth;
