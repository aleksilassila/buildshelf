import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import theme from "../constants/theme";
import Link from "next/link";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();
  const { code } = router.query;

  const handleUserJWT = (token, setError) => {
    const userObject = jwt.decode(token);
    if (!userObject) {
      setError("Error occurred while trying to log in.");
    } else {
      userObject.token = token;
      window.localStorage.setItem("user", JSON.stringify(userObject));
      router.push("/");
    }
  };

  const submitLogin = async () => {
    axios
      .post(process.env.BACKEND_ENDPOINT + "/login/mojang", {
        username,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          handleUserJWT(res.data, setError);
        } else {
          setError("Invalid credentials.");
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (code && !error) {
    axios
      .post(process.env.BACKEND_ENDPOINT + "/login/microsoft", { code })
      .then((res) => {
        if (res.status === 200) {
          handleUserJWT(res.data, setError);
        } else {
          setError("Error occurred while signing in.");
        }
      })
      .catch((err) => {
        setError(err);
      });

    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="login">
        <Link href="/">
          <a className="back">〈 Back</a>
        </Link>
        <h2 className="title">Log in with your Minecraft account</h2>
        <span className="disclosure">
          Your credentials will not be saved and are only sent to Mojang to
          verify your identity.
        </span>

        <form className="fields" onSubmit={(e) => e.preventDefault()}>
          <Input
            value={username}
            placeholder="Username"
            setValue={setUsername}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            setValue={setPassword}
          />
          <div className="submit">
            <Button onClick={submitLogin}>Log In</Button>
            <Button
              onClick={() => {
                router.push(
                  `https://login.live.com/oauth20_authorize.srf?client_id=e74b6ce2-9270-4f94-9bbb-8d7e9afb9a0f&scope=XboxLive.signin%20offline_access&redirect_uri=${process.env.MICROSOFT_REDIRECT_URI}&response_type=code`
                );
              }}
              mode="primary"
            >
              Log in via Microsoft
            </Button>
          </div>
        </form>
        <span>{error?.message}</span>
      </div>
      <style jsx>{`
        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: ${theme.lightMediumContrast};
          padding: 2em;
        }

        .login {
          background-color: ${theme.lightHighContrast};
          padding: 3em 2em;
          border-radius: 4px;
          width: 100%;
          max-width: 700px;
          position: relative;
        }

        .fields {
          margin-top: 2em;
        }

        .fields > :global(.input) {
          margin: 0.5em 0;
        }

        .submit {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .submit > :global(.button) {
          flex: 1 0 min-content;
        }

        .submit > :global(*:not(:last-child)) {
          margin-right: 0.5em;
        }

        .back {
          position: absolute;
          top: 1.4rem;
          left: 1.6rem;
          font-size: 0.8em;
          color: ${theme.darkLowContrast};
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default Login;
