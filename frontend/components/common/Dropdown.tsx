import { useState } from "react";
import theme from "../../constants/theme";
import Button from "./Button";
import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";

interface Props {
  items: any[];
  children: any;
}

export interface DropdownData {
  items: {
    content: JSX.Element | string;
    onClick: () => void;
  }[];
}

const Dropdown = ({
  data,
  children,
}: {
  data: DropdownData;
  children: JSX.Element | string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="dropdown">
      <Button onClick={() => setVisible(!visible)}>{children}<ChevronDown style={{ height: "0.8em" }} /></Button>
      <div className="background" onClick={() => setVisible(false)} />
      <div className="list" onClick={() => setVisible(false)}>
        {data.items.map((item, index) => (
          <Button key={index} onClick={item.onClick}>
            {item.content}
          </Button>
        ))}
      </div>
      <style jsx>{`
        .dropdown {
          position: relative;
          height: 2.2rem;
        }
        
        .dropdown > :global(.button) {
          position: relative;
          z-index: ${visible ? "2" : "unset"};
          justify-content: space-between;
        }

        .list {
          position: relative;
          visibility: ${visible ? "visible" : "hidden"};
          z-index: 2;
          background-color: ${theme.lightHighContrast};
          border: 1px solid ${theme.lightLowContrast};
          border-radius: 4px;
          margin-top: 0.5em;
          flex-direction: column;
          overflow: hidden;
        }
        
        .list > :global(*) {
          border: none;
          border-radius: 0;
          border-bottom: 1px solid ${theme.lightLowContrast};
        }
        
        .list > :global(*):last-child {
          border-bottom: none;
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
