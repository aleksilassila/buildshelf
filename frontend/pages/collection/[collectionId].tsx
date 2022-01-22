import TitleBar from "../../components/bars/TitleBar";
import Separator from "../../components/utils/Separator";
import TitleSubtitlePicture from "../../components/TitleSubtitlePicture";
import {useApi} from "../../components/hooks/api";
import {Collection} from "../../interfaces/ApiResponses";
import {useRouter} from "next/router";
import Loading from "../../components/statuses/Loading";
import NetworkError from "../../components/statuses/NetworkError";
import ImageCollection from "../../components/ImageCollection";

const CollectionPage = () => {
  const {collectionId} = useRouter().query;
  const [collection, loading, error] = useApi<Collection>(
    "/collection/" + collectionId,
    {},
    [collectionId]
  );

  if (loading) {
    return (
      <div style={{display: "flex"}} className="fullscreen">
        <Loading/>
      </div>
    );
  } else if (error) {
    return (
      <div style={{display: "flex"}} className="fullscreen">
        <NetworkError/>
      </div>
    );
  }

  return (
    <div className="collection">
      <TitleBar />
      <div className="medium-page-container">
        <div className="collection-title">
          <TitleSubtitlePicture
            title={collection.name}
            subtitle={
              <span>
                Collection by{" "}
                <a
                  href={"/user/" + collection.creator?.uuid}
                  className="username"
                >
                  {collection.creator?.username}
                </a>
              </span>
            }
            picture={
              <img
                src={
                  collection.creator &&
                  "https://crafatar.com/avatars/" + collection.creator.uuid
                }
                alt={collection.creator?.username}
                className="profile-picture"
              />
            }
          />
        </div>
        {collection.images ? <><ImageCollection images={collection.images} />{Separator}</> : null}
        {Separator}
      </div>
      <style jsx>{`
        .collection {
        }

        .username {
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default CollectionPage;
