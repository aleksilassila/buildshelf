import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import theme from "../constants/theme";
import Link from "next/link";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  const submitLogin = async () => {
    axios
      .post("http://localhost:9000/api/login", {
        username,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          const userObject = jwt.decode(res.data);
          if (!userObject) {
            setError("Error occurred while trying to log in.");
          } else {
            userObject.token = res.data;
            window.localStorage.setItem("user", JSON.stringify(userObject));
            router.push("/");
          }
        } else {
          setError("Invalid credentials.");
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (error) {
  }

  return (
    <div className="container">
      <div className="login">
        <Link href="/">
          <a className="back">Back</a>
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
            <Button onClick={() => {}}>Log in via Microsoft</Button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: ${theme.mediumContrastLight};
          padding: 2em;
        }

        .login {
          background-color: ${theme.highContrastLight};
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
          top: 1.5rem;
          left: 2rem;
          font-size: 0.8em;
          color: ${theme.lowContrastDark};
        }
      `}</style>
    </div>
  );
};

export default Login;
