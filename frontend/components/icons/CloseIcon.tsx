import theme from "../../constants/theme";

const CloseIcon = ({ close }) => <div onClick={close}>
    <style jsx>
        {`
            div {
                width: 33px;
                height: 33px;
            }
            
            div:before, div:after {
                position: absolute;
                left: 16px;
                content: ' ';
                height: 33px;
                width: 3px;
                background-color: ${theme.lowContrastLight};
                border-radius: 3px;
            }
            div:before {
                transform: rotate(45deg);
            }
            div:after {
                transform: rotate(-45deg);
            }

        `}
    </style>
</div>

export default CloseIcon;
