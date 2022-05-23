const Banner = ({ children, url }) => (
  <div className="page-container-lg">
    {children}
    <style jsx>{`
      .page-container-lg {
        background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
          url("${url}") no-repeat center center;
        background-size: cover;
      }
    `}</style>
  </div>
);

const BannerTitle = ({ children }) => (
  <h1 className="text-3xl font-black text-white text-center">{children}</h1>
);

const BannerSubtitle = ({ children }) => (
  <h2 className="text-white text-center">{children}</h2>
);

export { Banner, BannerTitle, BannerSubtitle };
