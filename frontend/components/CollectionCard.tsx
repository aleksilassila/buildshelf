import { Collection } from "../interfaces/Builds";
import theme from "../constants/theme";
import Heart from "./icons/Heart";
import Link from "next/link";

interface Props {
  collection: Collection;
}

const CollectionCard = ({ collection }: Props) => {
  /*
  Picture
  name
  creator
  description
  category
  build count
  favorite count
  created at?
   */

  const Picture = () => {
    if (collection.image) {
      return (
        <div
          className={"picture"}
          style={{
            background: `url("${
              process.env.BACKEND_ENDPOINT + "/files/" + collection.image
            }")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "200px",
            maxWidth: "350px",
            width: "35vw",
            margin: "1em",
            borderRadius: "4px",
          }}
        />
      );
    } else if (false) {
      // Do collage of build pictures or something.
    }
    return <div className="picture" />;
  };

  return (
    <div className="collection-card">
      <Picture />
      <div className="card-right">
        <div className="card-heading">
          <Link href={"/collection/" + collection.id}>
            <h3 className="name">
              {collection.name}
            </h3>
          </Link>
          <span className="build-count">{collection.builds.length} builds</span>
        </div>
        <div className="card-content">
          <p className="description">{collection.description}</p>
          <div className="stats">
            <div className="stats-right">
              By <span className={"stats-bold"}>_Jeb</span>
              {collection.categoryName ? " in " + collection.categoryName : ""}
            </div>
            <div className="stats-left">
              <Heart /> {collection._totalFavorites}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .collection-card {
          background-color: ${theme.lightHighContrast};
          border-radius: 4px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          overflow: hidden;
        }

        .card-right {
          flex: 1 0 auto;
          display: flex;
          flex-direction: column;
          padding: 1em;
        }

        .card-heading {
          // border-bottom: 1px solid ${theme.lightLowContrast};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .name {
          cursor: pointer;
        }

        .name:hover {
          text-decoration: underline;
        }

        .build-count {
          font-size: 0.9em;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1 0 auto;
        }

        .description {
        }

        .stats {
          font-size: 0.9em;
          font-weight: 500;
          margin-top: 1em;
          color: ${theme.darkLowContrast};
          display: flex;
          justify-content: space-between;
        }

        .stats-bold {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CollectionCard;
