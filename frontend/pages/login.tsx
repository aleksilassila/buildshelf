import {useRouter} from "next/router";
import {useState} from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import theme from "../theme";

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
        const response = await axios.post('http://localhost:9000/api/login', {
            username,
            password,
            clientToken: "a",
        }).catch(err => {
            console.error("Error occurred", err);
            setLoginError("Invalid credentials.")
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
        <div className="login">
            <div>
                <h2 className="title">Log in with your Minecraft account</h2>
                <span className="disclosure">Your credentials will not be saved and are only sent to Mojang.</span>

                <form className="fields" onSubmit={e => e.preventDefault()}>
                    <input type="text" placeholder="Username" value={username}
                           onChange={e => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password}
                           onChange={e => setPassword(e.target.value)} />
                    <button onClick={submitLogin}>Submit</button>
                </form>

                {loginError !== null && <span>{loginError}</span>}
            </div>
            <style jsx>{`
                .login {
                    background-color: ${theme.darkPurple};
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }
                
                .login > div {
                    background-color: #00000088;
                    padding: 4em;
                }
                
                .title {
                    margin: 0;
                }
                
                .disclosure {
                    font-size: 0.8em;
                    margin-bottom: 2em;
                    display: block;
                }
                
                .fields {
                    //display: flex;
                    //justify-content: center;
                    //flex-flow: column;
                }
                
                input, button {
                    display: block;
                    margin: 0.2em auto;
                }
            `}</style>
        </div>
    );
}

export default Login;
