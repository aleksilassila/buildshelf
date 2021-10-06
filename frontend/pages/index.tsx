import TitleBar from "../components/TitleBar";
import theme from "../theme";
import BuildsList from "../containers/BuildsList";
import useAxios from "axios-hooks";

const Home = () => {
    const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + '/builds/top');
    return (
        <div className={'background'}>
            <TitleBar />
            <div className="banner">
                <h2>Welcome to Litematica Library</h2>
                <span>A Place to Browse and Share Litematica Builds. You can download Litematica mod{" "}
                    <a href="https://www.curseforge.com/minecraft/mc-mods/litematica">here</a>.</span>
            </div>

            <BuildsList builds={data || []} />

            <style jsx>{`
                .background {
                    background-color: ${theme.highContrastDark};
                    min-height: 100vh;
                    width: 100vw;
                }
                
                .banner {
                    margin: 2em;
                    padding: 1em;
                    background-color: ${theme.lowContrastDark};
                    border-radius: 4px;
                }
                
                .banner h2 {
                    margin: 0;
                    font-size: 1.2em;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                
                .banner span {
                    font-size: 0.9em;
                }
            `}</style>
        </div>
    );
};

export default Home;
