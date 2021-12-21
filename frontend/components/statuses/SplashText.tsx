const SplashText = ({ children }) => {
  return (
    <div className="splash-text-container">
      {children}
      <style jsx>{`
        .splash-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default SplashText;
