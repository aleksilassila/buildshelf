import theme from "../../constants/theme";
import {useState} from "react";

const Button = ({children, onClick, highlighted = false, danger = false}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = (e) => {
    if (!danger) {
      onClick(e);
    } else {
      if (isFocused) {
        onClick();
        e.target.blur();
      } else {
        setIsFocused(true);
      }
    }
  };

  return (
    <div
      className="button"
      onBlur={() => setIsFocused(false)}
      onClick={handleClick}
      tabIndex={0}
    >
      {children}
      <style jsx>{`
        .button {
          border: 1px solid ${theme.lowContrastLight};
          background-color: ${highlighted
        ? theme.layout
        : theme.highContrastLight};
          color: ${highlighted
        ? theme.highContrastLight
        : theme.highContrastDark};
          font-weight: ${highlighted ? 500 : 400};
          text-align: ${highlighted ? "center" : "left"};
          border-radius: 4px;
          height: 2.3em;
          font-size: 0.9em;

          padding: 0.4em 1em;
          cursor: pointer;
          transition: background-color 100ms linear;
        }

        .button:active {
          background-color: ${theme.mediumContrastLight};
        }

        .button:focus {
          ${danger &&
      `
          background-color: ${theme.red};
          color: ${theme.highContrastLight};
          `}
        }
      `}</style>
    </div>
  );
};

export default Button;
