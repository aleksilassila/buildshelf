import theme from "../../constants/theme";

const Separator = (
  <div className="separator">
    <style jsx>
      {`
        .separator {
          background-color: ${theme.lowContrastLight}80;
          height: 2px;
          margin: 1em 0;
          border-radius: 20px;
          width: auto;
        }
      `}
    </style>
  </div>
);

export default Separator;
