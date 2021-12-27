const SplashText = ({ children, fullscreen = false }) => {
  return (
    <div className="splash-text-container">
      {children}
      <style jsx>{`
        .splash-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          ${fullscreen ?
          `
            height: 100vh;
            width: 100vw;
          ` : ""}
        }
      `}</style>
    </div>
  );
};

export default SplashText;
