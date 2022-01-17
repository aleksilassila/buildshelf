import theme from "../../constants/theme";
import Status from "./Status";

const Empty = () => (
  <Status>
    It's quite empty here.
    <style jsx>{`
      span {
        color: ${theme.darkLowContrast}88;
        font-size: 0.9em;
        text-align: center;
      }
    `}</style>
  </Status>
);

export default Empty;