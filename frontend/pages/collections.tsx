import TitleBar from "../components/bars/TitleBar";
import ListView from "../containers/ListView";
import { useEffect, useState } from "react";
import Auth from "../utils/auth";
import axios from "axios";
import CollectionCard from "../components/CollectionCard";
import theme from "../constants/theme";

const Collections = () => {
  const [params, setParams] = useState({
    page: 0,
    sort: "Top",
    name: "",
  });

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(true);

  const userObject = Auth.getUser();

  useEffect(() => {
    if (userObject === undefined || error || !refetch) return;

    axios
      .get(process.env.BACKEND_ENDPOINT + "/collections/get", {
        params: {
          offset: params.page * 20,
          amount: 20,
          sort: params.sort.toLowerCase(),
          name: params.name,
          token: userObject?.token,
        },
      })
      .then((res) => {
        setData([...data, ...res.data]);
        setRefetch(false);
      })
      .catch(setError);
  }, [refetch, userObject]);

  return (
    <div className="container">
      <TitleBar active="collections" />
      <div className="large-page-container">
        <h1>Collections</h1>
        <p>Browse popular build collections</p>
      </div>
      <div className="page-container">
        <ListView>
          {data.map((item) => (
            <CollectionCard collection={item} />
          ))}
        </ListView>
      </div>
      <style jsx>
        {`
          .page-container {
            background-color: ${theme.light};
          }
        `}
      </style>
    </div>
  );
};

export default Collections;