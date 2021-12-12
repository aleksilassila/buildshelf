import {useState} from "react";
import theme from "../../theme";

interface Props {
    items: any[],
    children: any,
}

const Dropdown = ({ items, children }: Props) => {
    const [visible, setVisible] = useState(false);

    return <div className="container">
        <div className="button" onClick={() => setVisible(!visible)}>
            {children}
        </div>
        <div className="list" onClick={() => setVisible(false)}>
            {items}
        </div>
        <style jsx>{`
            .container {
                position: relative;
            }
            
            .button {
                border: 1px solid ${theme.lowContrastLight};
                border-radius: 4px;
                padding: 0.4em 1em;
            }
            
            .button:hover {
                background-color: ${theme.lowContrastLight};
                border: 1px solid ${theme.lowContrastLight}00;
                cursor: pointer;
            }
            
            .list {
                display: ${visible ? "flex" : "none"};
                position: absolute;
                z-index: 1;
                background-color: ${theme.highContrastLight};
                border: 1px solid ${theme.lowContrastLight};
                border-radius: 4px;
                margin-top: 0.5em;
                min-width: 150px;
                flex-direction: column;
            }
        `}</style>
    </div>
}

export default Dropdown;
