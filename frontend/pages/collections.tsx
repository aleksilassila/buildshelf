import TitleBar from "../components/bars/TitleBar";
import ListView from "../containers/ListView";
import { useEffect, useState } from "react";
import Auth from "../utils/auth";
import axios from "axios";
import CollectionCard from "../components/CollectionCard";
import theme from "../constants/theme";
import Separator from "../components/utils/Separator";
import Dropdown from "../components/common/Dropdown";
import Input from "../components/common/Input";
import SortingBar from "../components/bars/SortingBar";
import { Category } from "../interfaces/Builds";
import ErrorText from "../components/statuses/ErrorText";
import messages from "../constants/messages";
import SplashText from "../components/statuses/SplashText";
import InfiniteScroll from "../containers/InfiniteScroll";
import Empty from "../components/statuses/Empty";
import ChevronDown from "../components/icons/ChevronDown";
import NBSP from "../components/utils/NBSP";
import Center from "../components/utils/Center";

const Collections = () => {
  const [params, setParams] = useState({
    page: 0,
    sort: "Top",
    name: "",
    category: "",
  });

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

  const [searchValue, setSearchValue] = useState("");

  const userObject = Auth.getUser();

  useEffect(() => {
    if (userObject === undefined || error || !refetch) return;
    setRefetch(false);

    // Fetch categories
    if (!categories.length) {
      axios
        .get(process.env.BACKEND_ENDPOINT + "/categories")
        .then((res) => setCategories(res.data))
        .catch((err) => setCategories(null));
    }

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
      })
      .catch(setError);
  }, [refetch, userObject]);

  const doSearch = () => {
    if (searchValue !== params.name) {
      setData([]);
      setParams({ ...params, name: searchValue, page: 0 });
      setRefetch(true);
    }
  };

  const SortDropdown = (
    <Dropdown
      data={{
        items: [
          {
            content: "Top",
            onClick: () => setParams({ ...params, sort: "Top" }),
          },
          {
            content: "Popular",
            onClick: () => setParams({ ...params, sort: "Top" }),
          },
          {
            content: "New",
            onClick: () => setParams({ ...params, sort: "New" }),
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

  const CategoryDropdown = (
    <Dropdown
      data={{
        items:
          categories === null
            ? [
                {
                  content: "Error",
                  onClick: () => {},
                },
              ]
            : [
                {
                  content: "All",
                  onClick: () => setParams({ ...params, category: "" }),
                },
              ].concat(
                categories.map((c) => ({
                  content: c.name.charAt(0).toUpperCase() + c.name.slice(1),
                  onClick: () => setParams({ ...params, category: c.name }),
                }))
              ),
      }}
    >
      <div>
        {params.category
          ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
          : "Category"}
      </div>
    </Dropdown>
  );

  const loading = !data.length && refetch;
  const empty = !data?.length && !loading && !error;

  return (
    <div className="collections">
      <TitleBar active="collections" />
      <div className="large-page-container">
        <h1>Collections</h1>
        <p>Browse popular build collections</p>
      </div>
      <div className="page-container">
        <SortingBar
          SearchInput={SearchInput}
          RightButton={CategoryDropdown}
          SortDropdown={SortDropdown}
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
          {!error && !loading && !empty && (
            <InfiniteScroll
              page={params.page}
              incrementPage={() => {
                setParams((l) => ({ ...l, page: l.page + 1 }));
                setRefetch(true);
              }}
            >
              <ListView>
                {data.map((item, index) => (
                  <CollectionCard key={index} collection={item} />
                ))}
              </ListView>
            </InfiniteScroll>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .collections {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .large-page-container {
            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("/mockImages/village.png") no-repeat center center;
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

export default Collections;
