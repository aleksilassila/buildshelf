import theme from "../../constants/theme";

const MultipleButton = ({ children, active }) => {
    return <div className="container">
        {children.filter(i => i !== null).map((c, i) => <div className={i === active && "active"} key={i}>{c}</div>)}
        <style jsx>
            {`
                .container {
                  border: 1px solid ${theme.lowContrastLight};
                  border-radius: 4px;
                  display: inline-flex;
                  flex-direction: row;
                }
                
                .container > * {
                  padding: 0.4em 1em;
                  border-right: 1px solid ${theme.lowContrastLight};
                }
                
                .container > *:last-child {
                  border: none;
                }
                
                .container > *:hover {
                  background-color: ${theme.lowContrastLight};
                  cursor: pointer;
                }
                
                .active {
                  cursor: unset;
                  background-color: ${theme.lowContrastLight};
                }
            `}
        </style>
    </div>;
}

export default MultipleButton;
