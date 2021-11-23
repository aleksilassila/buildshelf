import theme from "../../theme";

const FormButton = ({ children, onClick }) => {
    return <button onClick={onClick} >
        {children}
        <style jsx>
            {`
                button {
                    background-color: ${theme.layout};
                    color: ${theme.highContrastLight};
                    border: 2px solid ${theme.layout};
                    font-weight: 600;
                    cursor: pointer;
                    
                    font-family: "Open Sans", sans-serif;
                    padding: 0.4em 0.8em;
                    border-radius: 999px;
                    outline: none;
                    display: block;
                }
            `}
        </style>
    </button>;
}

export default FormButton;
