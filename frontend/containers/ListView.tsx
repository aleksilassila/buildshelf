import Empty from "../components/statuses/Empty";
import NetworkError from "../components/statuses/NetworkError";
import Loading from "../components/statuses/Loading";

const ListView = ({ children, loading, error }) => {

  if (loading && children?.length === 0) {
    return <Loading />
  } else if (error) {
    return <NetworkError />
  } else if (children?.length === 0) {
    return <Empty />
  }

  return (
    <div className="list-view">
      {children.map((item, index) => <div className="item" key={index}>{item}</div>)}
      <style jsx>
        {`
          .list-view {
            display: flex;
            flex-direction: column;
            margin: -1em;
          }
          
          .item {
            margin: 1em;
          }
        `}
      </style>
    </div>
  );
};

export default ListView;
