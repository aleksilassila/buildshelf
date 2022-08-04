import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import Loading from "../components/statuses/Loading";

const Login = () => {
  const [error, setError] = useState(null);

  const router = useRouter();
  const { code } = router.query;

  useEffect(() => console.log(error), [error]);

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

  return <Loading />;
};

export default Login;
