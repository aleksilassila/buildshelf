import { ReactNode } from "react";

const Banner: ({
  children,
  url,
  className,
}: {
  children?: ReactNode;
  url?: string;
  uri?: string;
  className?: string;
}) => JSX.Element = ({ children, url, uri, className }) => (
  <div
    className={"px-[5vw] py-[8vh] " + className}
    style={{
      background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
          url("${
            url || process.env.BACKEND_ENDPOINT + "/files/" + uri
          }") no-repeat center center`,
      backgroundSize: "cover",
    }}
  >
    {children}
  </div>
);

const BannerTitle = ({ children }) => (
  <h1 className="text-3xl font-black text-white text-center">{children}</h1>
);

const BannerSubtitle = ({ children }) => (
  <h2 className="text-white text-center">{children}</h2>
);

export { Banner, BannerTitle, BannerSubtitle };
