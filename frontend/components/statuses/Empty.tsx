import theme from "../../constants/theme";

const Empty = () => (
  <span>
    It's quite empty here.
    <style jsx>{`
      span {
        color: ${theme.darkLowContrast}88;
        font-size: 0.9em;
        text-align: center;
      }
    `}</style>
  </span>
);

export default Empty;