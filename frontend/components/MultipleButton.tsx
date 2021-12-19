import theme from "../constants/theme";

const MultipleButton = ({ children, active = -1, inactive = -1 }) => {
    return <div className="container">
        {children.filter(i => i !== null).map((c, i) =>
            <div className={i === active ? "active" : i === inactive ? "inactive" : null} key={i}>{c}</div>)}
        <style jsx>
            {`
                .container {
                  border: 1px solid ${theme.lowContrastLight};
                  background-color: ${theme.highContrastLight};
                  border-radius: 4px;
                  height: 2.3em;
                  font-size: 0.9em;
                  
                  display: inline-flex;
                  flex-direction: row;
                }
                
                .container > * {
                  padding: 0.4em 1em;
                  border-right: 1px solid ${theme.lowContrastLight};
                  cursor: pointer;
                }
                
                .container > *:active {
                  background-color: ${theme.mediumContrastLight};
                }
                
                .container > *:last-child {
                  border: none;
                }
                
                .active {
                  cursor: unset !important;
                  background-color: ${theme.lowContrastLight};
                }
                
                .inactive {
                  cursor: unset !important;
                }
                
                .inactive:active {
                  background-color: ${theme.highContrastLight} !important;
                }
            `}
        </style>
    </div>;
}

export default MultipleButton;
