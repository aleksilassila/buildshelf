import TitleBar from "../components/bars/TitleBar";
import theme from "../constants/theme";
import SortingBar from "../components/bars/SortingBar";
import CardsGridView from "../containers/CardsGridView";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorText from "../components/statuses/ErrorText";
import messages from "../constants/messages";
import SplashText from "../components/statuses/SplashText";
import Auth from "../utils/auth";
import Separator from "../components/icons/Separator";
import InfiniteScroll from "../containers/InfiniteScroll";

const Empty = () => (
  <span>
    It's quite empty here.
    <style jsx>{`
      span {
        color: ${theme.darkLowContrast}88;
        font-size: 0.9em;
      }
    `}</style>
  </span>
);

const Builds = () => {
  const [params, setParams] = useState({
    page: 0,
    sort: "Top",
    title: "",
  });

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(true);

  const [filtersToggled, setFiltersToggled] = useState(false);

  const userObject = Auth.getUser();

  useEffect(() => {
    if (userObject === undefined || error || !refetch) return;

    axios
      .get(process.env.BACKEND_ENDPOINT + "/builds/get", {
        params: {
          offset: data.length ? 50 + (params.page - 1) * 20 : 0,
          amount: data.length ? 20 : 50,
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

  const doSearch = (term: string) => {
    if (term !== params.title) {
      setData([]);
      setParams({ ...params, title: term, page: 0 });
      setRefetch(true);
    }
  };

  const loading = !data.length && refetch;
  const empty = !data?.length && !refetch;

  return (
    <div className="builds">
      <TitleBar active="builds" />
      <div className="container">
        <SortingBar
          sortBy={params.sort}
          setSortBy={(value) => {
            setParams({ ...params, sort: value });
            setRefetch(true);
          }}
          filtersToggled={filtersToggled}
          setFiltersToggled={setFiltersToggled}
          doSearch={doSearch}
        />
        {Separator}
        <div className="content">
          {error ? (
            <ErrorText>
              <h2>{messages.errorTitle}</h2>
              <p>Could not fetch builds.</p>
            </ErrorText>
          ) : null}
          {loading ? (
            <SplashText>
              <p>{messages.loading}</p>
            </SplashText>
          ) : null}
          {empty ? <Empty /> : null}
          {!error && !loading && !empty ? (
            <InfiniteScroll
              page={params.page}
              incrementPage={() => {
                setParams((l) => ({ ...l, page: l.page + 1 }));
                setRefetch(true);
              }}
            >
              <CardsGridView builds={data} />
            </InfiniteScroll>
          ) : null}
        </div>
      </div>
      <style jsx>
        {`
          .builds {
            background-color: ${theme.lightHighContrast};
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
          }

          .container {
            padding: 2em;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }

          .content {
            flex-grow: 1;
            display: flex;
            align-items: ${empty || loading || error ? "center" : "start"};
            justify-content: ${empty || loading || error ? "center" : "start"};
          }
        `}
      </style>
    </div>
  );
};

export default Builds;
