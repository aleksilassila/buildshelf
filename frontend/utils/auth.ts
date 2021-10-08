export interface UserObject {
    username: string,
    token: string,
    id: string,
    iat: number,
}

class Auth {
    static getUser = function (): UserObject {
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
