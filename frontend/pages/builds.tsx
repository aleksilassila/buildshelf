import TitleBar from "../components/bars/TitleBar";
import theme from "../constants/theme";
import CardsGridView from "../containers/CardsGridView";
import { useState } from "react";
import Separator from "../components/utils/Separator";
import InfinityScroll from "../containers/InfinityScroll";
import { useApiFeed } from "../utils/api";
import { Build } from "../interfaces/ApiResponses";
import {
  SortingBar,
  SortingBarLeft,
  SortingBarRight,
} from "../components/bars/SortingBar";
// import SortDropdown from "../components/bars/sortingBar/SortDropdown";
import * as Dropdown from "../components/ui/Dropdown";
import SearchInput from "../components/bars/sortingBar/SearchInput";
import CategoriesDropdown from "../components/bars/sortingBar/CategoriesDropdown";
import { Banner, BannerSubtitle, BannerTitle } from "../components/Banner";

const Builds = () => {
  const [params, setParams] = useState({
    sort: "top",
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
    <div className="flex flex-col min-h-screen">
      <TitleBar active="builds" />
      <Banner url="/mockImages/landscape.png">
        <BannerTitle>Builds</BannerTitle>
        <BannerSubtitle>Browse popular builds</BannerSubtitle>
      </Banner>
      <div className="page-container">
        <SortingBar>
          <SortingBarLeft>
            <Dropdown.Root
              onValueChange={(sort) =>
                doSearch({ sort: sort === "popular" ? "top" : sort })
              }
              defaultValue={params.sort}
            >
              <Dropdown.Group>
                <Dropdown.Label>Sort By</Dropdown.Label>
                <Dropdown.Item value="popular">Popular</Dropdown.Item>
                <Dropdown.Item value="top">Top</Dropdown.Item>
                <Dropdown.Item value="new">New</Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Root>
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
