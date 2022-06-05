import TitleBar from "../../components/bars/TitleBar";
import Separator from "../../components/utils/Separator";
import { useApi } from "../../utils/api";
import { Collection } from "../../interfaces/ApiResponses";
import { useRouter } from "next/router";
import Loading from "../../components/statuses/Loading";
import NetworkError from "../../components/statuses/NetworkError";
import CardsGridView from "../../containers/CardsGridView";
import CollectionTitle from "../../components/collectionPage/CollectionTitle";
import * as Slides from "../../components/containers/Slides";
import { Banner } from "../../components/Banner";

const CollectionPage = () => {
  const { collectionId } = useRouter().query;
  const [collection, loading, error] = useApi<Collection>(
    "/collection/" + collectionId,
    {},
    [collectionId]
  );

  if (loading) {
    return (
      <div className="page-container">
        <Loading />
      </div>
    );
  } else if (error) {
    return (
      <div className="page-container">
        <NetworkError />
      </div>
    );
  }

  return (
    <div className="">
      <Banner
        className=""
        uri={(collection.images || collection.builds[0]?.images)[0].filename}
      >
        <div className="flex flex-col gap-4 text-white w-1/2">
          <CollectionTitle collection={collection} className="self-start" />
          <div className="border-l pl-2 border-stone-100">
            {collection.description}
          </div>
        </div>
      </Banner>

      <div className="page-container">
        <CardsGridView
          builds={collection?.builds?.length ? collection?.builds : []}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default () => (
  <div className="flex flex-col min-h-screen">
    <TitleBar />
    <CollectionPage />
  </div>
);
