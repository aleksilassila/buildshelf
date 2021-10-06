import theme from "../../theme";

const Separator = <div>
    <style jsx>
        {`
            div {
                background-color: ${theme.lowContrastLight}80;
                height: 2px;
                margin: 1em 0;
                width: auto;
            }
        `}
    </style>
</div>

export default Separator;