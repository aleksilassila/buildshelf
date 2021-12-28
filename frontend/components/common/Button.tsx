import theme from "../../constants/theme";
import {useState} from "react";

const Button = ({children, onClick, highlighted: primary = false, danger = false}) => {
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
      <div className="content">
        {children}
      </div>
      <style jsx>{`
        .button {
          border: 1px solid ${theme.lightLowContrast};
          background-color: ${theme.lightHighContrast};
          color: ${theme.darkHighContrast};
          font-weight: 400;
          border-radius: 4px;
          height: 2.2rem;
          font-size: 0.9em;

          padding: 0.4em 1em;
          cursor: pointer;
          transition: background-color 100ms linear;
          display: flex;
          align-items: center;
        }
        
        .button:hover {
          background-color: ${theme.lightMediumContrast};
        }
        
        .primary {
          background-color: ${theme.layout};
          color: ${theme.lightHighContrast};
          font-weight: 500;
          text-align: center;
          border: 1px solid ${theme.layoutLight};
        }
        .primary:hover {
          background-color: ${theme.layoutDark};
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
