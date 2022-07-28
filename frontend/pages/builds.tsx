import TitleBar from "../components/bars/TitleBar";
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
import * as Dropdown from "../components/ui/Dropdown";
import SearchInput from "../components/bars/sortingBar/SearchInput";
import CategoriesDropdown from "../components/bars/sortingBar/CategoriesDropdown";
import { Banner, BannerSubtitle, BannerTitle } from "../components/Banner";

const Builds = () => {
  const [params, setParams] = useState({
    sort: "popular",
    name: "",
    categoryName: "",
  });

  const [builds, loading, error, fetchMore, refetch] = useApiFeed<Build>(
    "/builds/search",
    {
      params: {
        sort: params.sort.toLowerCase(),
        name: params.name,
        categoryName: params.categoryName,
        private: false,
      },
    }
  );

  const doSearch = ({
    name = params.name,
    categoryName = params.categoryName,
    sort = params.sort,
  }) => {
    if (
      name === params.name &&
      categoryName === params.categoryName &&
      sort === params.sort
    )
      return;

    setParams({ ...params, name, categoryName, sort });
    refetch({
      params: {
        name,
        sort: sort.toLowerCase(),
        categoryName,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TitleBar active="builds" />
      <Banner url="/mockImages/potatoes-2.png">
        <BannerTitle>Builds</BannerTitle>
        <BannerSubtitle>Browse popular builds</BannerSubtitle>
      </Banner>
      <div className="page-container">
        <SortingBar>
          <SortingBarLeft>
            <Dropdown.Root
              onValueChange={(sort) => doSearch({ sort })}
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
              doSearch={(name) => doSearch({ name })}
              placeholder="Search builds by name"
            />
          </SortingBarLeft>
          <SortingBarRight>
            <CategoriesDropdown
              doSearch={(categoryName) => doSearch({ categoryName })}
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
