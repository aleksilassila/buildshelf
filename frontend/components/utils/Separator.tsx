import theme from "../../constants/theme";

const Separator = (
  <div className="separator">
    <style jsx>
      {`
        .separator {
          background-color: ${theme.lightLowContrast}80;
          height: 2px;
          margin: 1em 0;
          border-radius: 20px;
          width: auto;
          flex-shrink: 0;
        }
      `}
    </style>
  </div>
);

export default Separator;
