import Navbar from "../../components/navbar/Navbar";
import { apiRequest, useApi } from "../../utils/api";
import { Collection } from "../../interfaces/ApiResponses";
import { useRouter } from "next/router";
import Loading from "../../components/statuses/Loading";
import NetworkError from "../../components/statuses/NetworkError";
import CardsGridView from "../../containers/CardsGridView";
import CollectionTitle from "../../components/collectionPage/CollectionTitle";
import { Banner } from "../../components/Banner";
import Separator from "../../components/utils/Separator";
import Button from "../../components/ui/Button";
import Auth from "../../utils/auth";

const FavoriteButton = ({
  collection,
  afterClick,
}: {
  collection: Collection;
  afterClick: () => void;
}) => (
  <Button
    mode={collection.isFavorite ? "default" : "primary"}
    onClick={() => {
      apiRequest({
        method: "POST",
        url: "/collections/" + collection.id + "/favorite",
        data: {
          favorite: !collection.isFavorite,
        },
      }).then(afterClick);
    }}
  >
    Favorite
  </Button>
);

const CollectionPage = () => {
  const { collectionId } = useRouter().query;
  const userObject = Auth.getUser();

  const [collection, loading, error, refresh] = useApi<Collection>(
    "/collections/" + collectionId,
    {},
    [collectionId]
  );

  if (loading && !collection) {
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
        uri={
          (collection.images || collection.builds?.[0]?.images)?.[0]?.filename
        }
      >
        <div className="flex flex-col gap-4 text-white w-1/2">
          <CollectionTitle collection={collection} className="self-start" />
          <div className="border-l pl-2 border-stone-100">
            {collection.description}
          </div>
        </div>
      </Banner>

      <div className="page-container">
        {userObject.isLoggedIn() && (
          <div>
            <div className="flex justify-between">
              <FavoriteButton collection={collection} afterClick={refresh} />
              {userObject.isLoggedIn(collection.creator.uuid) && (
                <Button mode="default">Edit</Button>
              )}
            </div>
            {Separator}
          </div>
        )}
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
    <Navbar />
    <CollectionPage />
  </div>
);
