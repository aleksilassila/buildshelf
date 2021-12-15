import theme from "../../constants/theme";

const FormInput = ({ value, setValue, placeholder, type = "text" }) => {
    return <>
        <input placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} type={type} />
        <style jsx>
            {`
                input {
                    background-color: ${theme.highContrastDark};
                    color: ${theme.lowContrastLight};
                    border: 2px solid ${theme.highContrastDark};
                    width: 250px;
                    
                    font-family: 'Avenir', Arial, sans-serif;
                    padding: 0.4em 0.8em;
                    border-radius: 999px;
                    outline: none;
                    display: block;
                }
                
                input:focus {
                    border-color: ${theme.layout};
                }
            `}
        </style>
    </>
}

export default FormInput;
