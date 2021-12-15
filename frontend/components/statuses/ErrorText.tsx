import theme from "../../constants/theme";

const ErrorText = ({ children }) => {
    return <div className="error-text-container">
        {children}
        <style global jsx>{`
          .error-text-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .error-text-container > * {
            color: ${theme.red};
          }
        `}</style>
    </div>
}

export default ErrorText;