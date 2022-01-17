import TitleBar from "../components/bars/TitleBar";
import theme from "../constants/theme";
import CardsGridView from "../containers/CardsGridView";
import { useState } from "react";
import Separator from "../components/utils/Separator";
import InfinityScroll from "../containers/InfinityScroll";
import { useApiFeed } from "../components/hooks/api";
import { Build } from "../interfaces/Builds";
import {
  SortingBar,
  SortingBarLeft,
  SortingBarRight,
} from "../components/bars/SortingBar";
import SortDropdown from "../components/bars/sortingBar/SortDropdown";
import SearchInput from "../components/bars/sortingBar/SearchInput";
import CategoriesDropdown from "../components/bars/sortingBar/CategoriesDropdown";

const Builds = () => {
  const [params, setParams] = useState({
    sort: "Top",
    title: "",
    category: "",
  });

  const [builds, loading, error, fetchMore, refetch] = useApiFeed<Build>(
    "/builds/get",
    {
      params: {
        sort: params.sort.toLowerCase(),
        title: params.title,
        category: params.category,
      },
    }
  );

  const doSearch = ({
    title = params.title,
    category = params.category,
    sort = params.sort,
  }) => {
    if (
      title === params.title &&
      category === params.category &&
      sort === params.sort
    )
      return;

    setParams({ ...params, title, category, sort });
    refetch({
      params: {
        title,
        sort: sort.toLowerCase(),
        category,
      },
    });
  };

  return (
    <div className="builds">
      <TitleBar active="builds" />
      <div className="large-page-container">
        <h1>Builds</h1>
        <p>Browse popular builds</p>
      </div>
      <div className="page-container">
        <SortingBar>
          <SortingBarLeft>
            <SortDropdown
              sort={params.sort}
              doSearch={(sort) => doSearch({ sort })}
            />
            <SearchInput
              doSearch={(title) => doSearch({ title })}
              placeholder="Search builds by title"
            />
          </SortingBarLeft>
          <SortingBarRight>
            <CategoriesDropdown
              doSearch={(category) => doSearch({ category })}
              category={params.category}
            />
          </SortingBarRight>
        </SortingBar>
        {Separator}
        <div className="content">
          <InfinityScroll fetchMore={fetchMore}>
            <CardsGridView
              builds={builds}
              loading={loading && builds?.length === 0}
              error={error}
            />
          </InfinityScroll>
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
          }
        `}
      </style>
    </div>
  );
};

export default Builds;
