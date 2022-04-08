import Loading from "../components/statuses/Loading";
import NetworkError from "../components/statuses/NetworkError";
import Empty from "../components/statuses/Empty";
import { Build } from "../interfaces/ApiResponses";
import Heart from "../components/icons/Heart";
import theme from "../constants/theme";

const Row = ({ build }: { build: Build }) => {
  return (
    <div className="row">
      {/*<div className="picture" />*/}
      <div className="content">
        <div className="content-left">
          <h3>{build.title}</h3>
          <span>By {build.creator?.username}</span>
        </div>
        <div className="content-right">
          <span>
            <Heart /> {build.totalSaves}
          </span>
        </div>
      </div>
      <style jsx>{`
        .row {
          display: flex;
          overflow: hidden;
          //box-shadow: ${theme.bottomShadow};
        }

        .picture {
          height: 80px;
          width: 110px;
          background: url("${process.env.BACKEND_ENDPOINT}/files/${build
              .images[0]}")
            center;
          background-size: cover;
        }

        .content {
          flex: 1 0 auto;
          display: flex;
          justify-content: space-between;
          padding: 0 1.5em;
          //border: 1px solid ${theme.lightLowContrast};
          //background-color: ${theme.lightHighContrast};
          align-items: center;
        }
      `}</style>
    </div>
  );
};

const BuildsTableView = ({ builds, loading, error }) => {
  if (loading && builds?.length === 0) {
    return <Loading />;
  } else if (error) {
    return <NetworkError />;
  } else if (builds?.length === 0) {
    return <Empty />;
  }

  return (
    <div className="builds-table-view">
      {builds.map((item, index) => (
        <div className="row" key={index}><Row build={item} /></div>
      ))}
      <style jsx>
        {`
          .builds-table-view {
            display: flex;
            flex-direction: column;
            padding: 1em;
            background-color: ${theme.lightHighContrast};
            border-radius: 4px;
            
          }

          .row:not(:last-child) {
            border-bottom: 1px solid ${theme.lightLowContrast}55;
          }
        `}
      </style>
    </div>
  );
};

export default BuildsTableView;
