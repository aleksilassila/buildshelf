import theme from "../constants/theme";

const Button = ({ children, onClick }) => {
    return <div className="container" onClick={onClick}>
        {children}
        <style jsx>{`
          .container {
            border: 1px solid ${theme.lowContrastLight};
            background-color: ${theme.highContrastLight};
            border-radius: 4px;
            height: 2.3em;
            font-size: 0.9em;
            
            padding: 0.4em 1em;
            cursor: pointer;
          }
          
          .container:active {
            background-color: ${theme.mediumContrastLight};
          }
          
          .filter-button-content {
            
          }
        `}</style>
    </div>
}

export default Button;