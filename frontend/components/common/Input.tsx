import theme from "../../constants/theme";

interface Props {
  value: string;
  setValue: (string) => void;
  placeholder: string;
  onEnter?: (e) => void | null;
  height?: string;
  type?: string;
  textArea?: boolean;
  onBlur?: () => void;
  children?: JSX.Element;
}

const Input = ({
  value,
  setValue,
  placeholder,
  onEnter = null,
  height = "2.2rem",
  type = "text",
  textArea = false,
  onBlur = () => {},
  children,
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
      {children}
      {textArea ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onBlur={onBlur}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
          onKeyDown={handleEnterKeyDown}
          onBlur={onBlur}
        />
      )}
      <style jsx>
        {`
            .input {
              width: 100%;
              height: ${height};
              border: 1px solid ${theme.lightLowContrast};
              border-radius: 4px;
              padding: 0.4em 1em;
              display: flex;
              align-items: center;
            }
  
            input,
            textarea {
              outline: none;
              border: none;
              background-color: #00000000;
              font-family: inherit;
              resize: vertical;
            }
            
            .input, .input > :global(*) {
              font-weight: 400;
              font-size: 0.96rem;
              color: ${theme.darkLowContrast};
            }
            
            .input > :global(*):not(:last-child) {
              margin-right: 0.5rem;
            }
  
            .input:hover,
            .input:focus-within {
              background-color: ${theme.lightMediumContrast};
            }
        `}
      </style>
    </div>
  );
};

export default Input;
