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
  height = "2.2rem",
  type = "text",
  textArea = false,
}: Props) => {
  const handleEnterKeyDown = (e) => {
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
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
          onKeyDown={handleEnterKeyDown}
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
            border: 1px solid ${theme.lightLowContrast};
            padding: 0.4em 1em;
            font-size: 0.96em;
            color: ${theme.darkHighContrast};
            font-weight: 400;
            height: ${height};
            width: 100%;
            resize: vertical;
            //box-shadow: inset 0 1px 2px ${theme.lightLowContrast};
          }

          input:focus-visible,
          textarea:focus-visible,
          input:hover,
          textarea:hover {
            //border: 1px solid ${theme.layout};
            background-color: ${theme.lightMediumContrast};
            color: ${theme.darkLowContrast};
          }
        `}
      </style>
    </div>
  );
};

export default Input;
