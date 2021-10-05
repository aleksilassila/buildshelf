import TitleBar from "../components/TitleBar";
import theme from "../theme";

const Builds = () => {
    return (
        <div className="builds">
            <TitleBar />
            <h2>Builds</h2>
            <style jsx>
                {`
                    .builds {
                        background-color: ${theme.highContrastDark};
                        height: 100vh;
                        width: 100vw;
                    }
                `}
            </style>
        </div>
    );
}

export default Builds;
