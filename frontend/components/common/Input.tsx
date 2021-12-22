import theme from "../../constants/theme";

const Input = ({
  value,
  setValue,
  placeholder,
  height = "2.2em",
  type = "text",
  textArea = false,
}) => {
  return (
    <div>
      {textArea ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
        />
      )}
      <style jsx>
        {`
          input,
          textarea {
            outline: none;
            appearance: none;
            font-family: inherit;
            border-radius: 4px;
            border: 1px solid ${theme.lowContrastLight};
            padding: 0.4em 1em;
            font-size: 0.96em;
            color: ${theme.highContrastDark};
            font-weight: 400;
            height: ${height};
            width: 100%;
            resize: vertical;
            //box-shadow: inset 0 1px 2px ${theme.lowContrastLight};
          }

          input:focus-visible,
          textarea:focus-visible {
            //border: 1px solid ${theme.layout};
            background-color: ${theme.lowContrastLight};
            color: ${theme.lowContrastDark};
          }
        `}
      </style>
    </div>
  );
};

export default Input;
