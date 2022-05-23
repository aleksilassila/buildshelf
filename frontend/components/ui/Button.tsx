import theme from "../../constants/theme";
import { useState } from "react";

const Button = ({ children, onClick, primary = false, danger = false }) => {
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
      className={`button ${danger && "danger"} ${primary && "primary"}`}
      onBlur={() => setIsFocused(false)}
      onClick={handleClick}
      tabIndex={0}
    >
      {children}
      <style jsx>{`
        .button {
          border: 1px solid ${theme.lightLowContrast};
          box-shadow: ${theme.bottomShadow};
          background-color: ${theme.lightHighContrast};
          color: ${theme.darkMediumContrast};
          font-weight: 500;
          border-radius: 4px;
          height: 2.2rem;
          font-size: 0.9em;

          padding: 0.4em 1em;
          cursor: pointer;
          transition: background-color 100ms linear;
          display: flex;
          align-items: center;
          flex: 0 0 auto;
        }

        .button:hover {
          background-color: ${theme.lightMediumContrast};
        }

        .primary {
          background-color: ${theme.layout};
          color: ${theme.lightHighContrast};
          font-weight: 500;
          text-align: center;
          border: 1px solid ${theme.layout};
        }

        .primary:hover {
          background-color: ${theme.layoutDark};
          border: 1px solid ${theme.layoutDark};
        }

        .danger:focus {
          background-color: ${theme.red};
          color: ${theme.lightHighContrast};
          border: 1px solid ${theme.redLight};
        }
      `}</style>
    </div>
  );
};

export default Button;
