import TitleBar from "../components/bars/TitleBar";
import ListView from "../containers/ListView";
import {useEffect, useState} from "react";
import Auth from "../utils/auth";
import axios from "axios";
import CollectionCard from "../components/CollectionCard";

const Collections = () => {
  const [params, setParams] = useState({
    page: 0,
    sort: "Top",
    title: "",
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
          title: params.title,
          token: userObject?.token,
        },
      })
      .then((res) => {
        setData([...data, ...res.data]);
        setRefetch(false);
      })
      .catch(setError);
  }, [refetch, userObject]);

  return <div className="container">
    <TitleBar active="collections" />
    <div className="content">
      <ListView>
        {
          data.map((item) => <CollectionCard collection={item} />)
        }
      </ListView>
    </div>
  </div>
}

export default Collections;