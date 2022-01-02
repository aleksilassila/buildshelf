import TitleBar from "../components/TitleBar";
import theme from "../constants/theme";
import SortingBar from "../components/builds/SortingBar";
import CardsGridView from "../containers/CardsGridView";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorText from "../components/statuses/ErrorText";
import messages from "../constants/messages";
import SplashText from "../components/statuses/SplashText";
import Auth from "../utils/auth";
import Separator from "../components/icons/Separator";

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
  const [page, setPage] = useState(0);

  const [sortBy, setSortBy] = useState<"Popular" | "Top" | "New">("Top");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersToggled, setFiltersToggled] = useState(false);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [refetch, setRefetch] = useState(true);

  const userObject = Auth.getUser();

  useEffect(() => {
    if ((userObject === undefined || error || data) && !refetch) return;
    console.log("Fetching builds...");
    setRefetch(false);

    const params: { sort: string; title?: string; token: string } = {
      sort: sortBy === "Popular" ? "top" : sortBy.toLocaleLowerCase(),
      token: userObject?.token,
    };

    if (searchTerm.length) {
      params.title = searchTerm;
    }

    axios
      .get(process.env.BACKEND_ENDPOINT + "/builds/get", { params })
      .then((res) => setData(res.data || []))
      .catch(setError);
  }, [sortBy, searchTerm, userObject]);

  const doSearch = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      setRefetch(true);
    }
  };

  return (
    <div className="builds">
      <TitleBar active="builds" />
      <div className="container">
        <SortingBar
          sortBy={sortBy}
          setSortBy={(value) => {
            setSortBy(value);
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
              <p>{messages.errorFetch("builds")}</p>
            </ErrorText>
          ) : !data ? (
            <SplashText>
              <p>{messages.loading}</p>
            </SplashText>
          ) : data?.length === 0 ? (
            <Empty />
          ) : (
            <CardsGridView builds={data} />
          )}
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
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

export default Builds;
