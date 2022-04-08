import { Build } from "../interfaces/ApiResponses";
import Heart from "./icons/Heart";
import theme from "../constants/theme";

const BuildRowCompact = ({ build }: { build: Build }) => {
  return (
    <div className="build-row-compact">
      <div className="picture" />
      <div className="content">
        <div className="content-left">
          <h3>{build.title}</h3>
          <span>By {build.creator?.username}</span>
        </div>
        <div className="content-right">
          <span><Heart /> {build.totalSaves}</span>
        </div>
      </div>
      <style jsx>{`
        .build-row-compact {
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: ${theme.bottomShadow};
        }
        
        .picture {
          height: 80px;
          width: 110px;
          background: url("${process.env.BACKEND_ENDPOINT}/files/${build.images[0]}") center;
          background-size: cover;
        }
        
        .content {
          flex: 1 0 auto;
          display: flex;
          justify-content: space-between;
          padding: 0 1.5em;
          //border: 1px solid ${theme.lightLowContrast};
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
          background-color: ${theme.lightHighContrast};
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default BuildRowCompact;
