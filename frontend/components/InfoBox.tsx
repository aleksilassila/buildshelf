import theme from "../constants/theme";

const InfoBox = ({ children }) => {
    return <div className="info-box">
        {children}
        <style jsx>
            {`
                .info-box {
                    margin: 2em;
                    padding: 1em;
                    background-color: ${theme.lowContrastDark};
                    border-radius: 4px;
                }
            `}
        </style>
    </div>;
}

export default InfoBox;