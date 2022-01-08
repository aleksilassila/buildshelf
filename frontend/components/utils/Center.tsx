const Center = ({ children, style = {} }) => (
  <div style={style} className="center">
    {children}
    <style jsx>{`
      .center {
        display: flex;
        align-items: center;
      }
    `}</style>
  </div>
);

export default Center;
