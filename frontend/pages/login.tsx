import {useRouter} from "next/router";
import {useState} from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

export interface User {
    accessToken: string,
    refreshToken: string,
    userId: string
    expiresAt: number,
    loggedInUntil: number,
}

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    const router = useRouter();

    const submitLogin = async () => {
        const response = await axios.post('https://localhost:9000/api/login', {
            username,
            password,
            clientToken: "",
        }).catch(err => {
            console.error("Error occurred", err);
            return err;
        });

        if (response instanceof Error) return;

        if (response.status === 200) {
            const userObject = jwt.decode(response.data);
            if (!userObject) {
                setLoginError('Error occurred while trying to log in.')
            } else {
                userObject.token = response.data;
                window.localStorage.setItem("user", JSON.stringify(userObject));
                router.push("/");
            }
        } else {
            setLoginError('Invalid credentials.')
        }
    }

    if (loginError) {

    }

    return (
        <div>
            <h2>Log in with your Minecraft account</h2>
            <span>Your credentials will not be saved and are only sent to Mojang.</span>

            <div>
                <input type="text" placeholder="Username" value={username}
                       onChange={e => setUsername(e.target.value)} />
                <input type="text" placeholder="Password" value={password}
                       onChange={e => setPassword(e.target.value)} />
                <button onClick={submitLogin}>Submit</button>
            </div>

            {loginError !== null && <span>{loginError}</span>}
        </div>
    );
}

export default Login;
