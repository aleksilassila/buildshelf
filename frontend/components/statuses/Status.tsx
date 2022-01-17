const Status = ({ children }) => {
  return (
    <div className="splash-text-container">
      {children}
      <style jsx>{`
        .splash-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1 0 auto;
        }
      `}</style>
    </div>
  );
};

export default Status;
