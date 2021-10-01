import TitleBar from "../components/TitleBar";
import theme from "../theme";

const Home = () => {
    return (
        <div className={'background'}>
            <TitleBar />

            <style jsx>{`
                .background {
                    background-color: ${theme.darkPurple};
                    height: 100vh;
                    width: 100vw;
                }
            `}</style>
        </div>
    );
};

export default Home;
