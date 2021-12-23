import theme from "../../constants/theme";

interface Props {
  value: string;
  setValue: (string) => void;
  placeholder: string;
  onEnter?: (e) => void | null;
  height?: string;
  type?: string;
  textArea?: boolean;
}

const Input = ({
  value,
  setValue,
  placeholder,
  onEnter = null,
  height = "2.2em",
  type = "text",
  textArea = false,
}: Props) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onEnter) {
        onEnter(e);
      } else {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="input">
      {textArea ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
          onKeyDown={handleKeyDown}
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
