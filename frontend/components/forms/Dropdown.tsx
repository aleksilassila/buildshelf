import { useState } from "react";
import theme from "../../constants/theme";
import Button from "../common/Button";

interface Props {
  items: any[];
  children: any;
}

const Dropdown = ({ items, children }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="container">
      <Button onClick={() => setVisible(!visible)}>
        {children}
      </Button>
      <div className="background" onClick={() => setVisible(false)} />
      <div className="list" onClick={() => setVisible(false)}>
        {items}
      </div>
      <style jsx>{`
        .container {
          position: relative;
        }

        .button:hover {
          background-color: ${theme.lowContrastLight};
          border: 1px solid ${theme.lowContrastLight}00;
          cursor: pointer;
        }

        .list {
          display: ${visible ? "flex" : "none"};
          position: absolute;
          z-index: 2;
          background-color: ${theme.highContrastLight};
          border: 1px solid ${theme.lowContrastLight};
          border-radius: 4px;
          margin-top: 0.5em;
          min-width: 150px;
          flex-direction: column;
        }

        .background {
          z-index: 1;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          display: ${visible ? "block" : "none"};
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
