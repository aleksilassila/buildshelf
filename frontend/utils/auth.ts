export interface UserObject {
    username: string;
    password: string;
    token: string;
}

class Auth {
    static getUser = function () {
        try {
            return JSON.parse(window.localStorage.getItem("user"));
        } catch {
            return undefined;
        }
    }

    static setUser = function (userObject: UserObject) {
        window.localStorage.setItem("user", JSON.stringify(userObject));
    }
}

export default Auth;
