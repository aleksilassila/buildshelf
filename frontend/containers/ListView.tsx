const ListView = ({ children }) => {
  return (
    <div className="list-view">
      {children.map(item => <div className="item">{item}</div>)}
      <style jsx>
        {`
          .list-view {
            display: flex;
            flex-direction: column;
            margin: -0.5em;
          }
          
          .item {
            margin: 0.5em;
          }
        `}
      </style>
    </div>
  );
};

export default ListView;
