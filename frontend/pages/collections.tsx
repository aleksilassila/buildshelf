import Navbar from "../components/navbar/Navbar";
import ListView from "../containers/ListView";
import { useState } from "react";
import CollectionCard from "../components/CollectionCard";
import Separator from "../components/utils/Separator";
import InfinityScroll from "../containers/InfinityScroll";
import { useApiFeed } from "../utils/api";
import { Collection } from "../interfaces/ApiResponses";
import {
  SortingBar,
  SortingBarLeft,
  SortingBarRight,
} from "../components/bars/SortingBar";
import * as Dropdown from "../components/ui/Dropdown";
import SearchInput from "../components/bars/sortingBar/SearchInput";
import CategoriesDropdown from "../components/bars/sortingBar/CategoriesDropdown";
import { Banner, BannerSubtitle, BannerTitle } from "../components/Banner";

const Collections = () => {
  const [params, setParams] = useState({
    sort: "top",
    name: "",
    categoryName: "",
  });

  const [collections, loading, error, fetchMore, refetch] =
    useApiFeed<Collection>(
      "/collections/search",
      {
        params: {
          sort: params.sort.toLowerCase(),
          name: params.name,
        },
      },
      10
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
        // category,
      },
    });
  };

  return (
    <div className="collections">
      <Navbar active="collections" />
      <Banner url="/mockImages/village.jpg">
        <BannerTitle>Collections</BannerTitle>
        <BannerSubtitle>Browse popular build collections</BannerSubtitle>
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
              doSearch={(name) => doSearch({ name })}
              placeholder="Search collections"
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
            <ListView
              loading={loading && collections?.length === 0}
              error={error}
            >
              {collections.map((c, i) => (
                <CollectionCard key={i} collection={c} />
              ))}
            </ListView>
          </InfinityScroll>
        </div>
      </div>
      <style jsx>
        {`
          .collections {
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

export default Collections;
