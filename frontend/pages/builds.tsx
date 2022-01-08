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
import Separator from "../components/utils/Separator";
import InfiniteScroll from "../containers/InfiniteScroll";
import Dropdown from "../components/common/Dropdown";
import Input from "../components/common/Input";
import Empty from "../components/statuses/Empty";

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
  const [searchValue, setSearchValue] = useState("");

  const userObject = Auth.getUser();

  useEffect(() => {
    if (userObject === undefined || error || !refetch) return;
    setRefetch(false);

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
      })
      .catch(setError);
  }, [refetch, userObject]);

  const doSearch = () => {
    if (searchValue !== params.title) {
      setData([]);
      setParams({ ...params, title: searchValue, page: 0 });
      setRefetch(true);
    }
  };

  const setSort = (sort) => () => {
    if (sort !== params.sort) {
      setData([])
      setParams(p => ({ ...p, sort }));
      setRefetch(true);
    }
  }

  const SortDropdown = (
    <Dropdown
      data={{
        items: [
          {
            content: "Top",
            onClick: setSort("Top"),
          },
          {
            content: "Popular",
            onClick: setSort("Top"),
          },
          {
            content: "New",
            onClick: setSort("New"),
          },
        ],
      }}
    >
      {params.sort}
    </Dropdown>
  );

  const SearchInput = (
    <Input
      value={searchValue}
      setValue={setSearchValue}
      placeholder={"Search builds by title"}
      onEnter={doSearch}
      onBlur={doSearch}
    />
  );

  const loading = !data.length && refetch;
  const empty = !data?.length && !loading && !error;

  return (
    <div className="builds">
      <TitleBar active="builds" />
      <div className="large-page-container">
        <h1>Builds</h1>
        <p>Browse popular builds</p>
      </div>
      <div className="page-container">
        <SortingBar
          SortDropdown={SortDropdown}
          SearchInput={SearchInput}
          RightButton={null}
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
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .large-page-container {
            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("/mockImages/landscape.png") no-repeat center center;
            background-size: cover;
          }

          .large-page-container > * {
            color: ${theme.light};
            text-align: center;
          }

          .page-container {
            display: flex;
            flex-direction: column;
            flex: 1 0 auto;
          }

          .content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: ${empty || loading || error ? "center" : "start"};
          }
        `}
      </style>
    </div>
  );
};

export default Builds;
