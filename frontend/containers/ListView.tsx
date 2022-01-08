const ListView = ({ children }) => {
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
