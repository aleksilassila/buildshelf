import TitleBar from "../components/TitleBar";
import theme from "../theme";
import useAxios from "axios-hooks";
import BuildsRow from "../containers/BuildsRow";

const Home = () => {
    const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + '/builds/top');
    return (
        <div className={'background'}>
            <TitleBar />
            <div className="introduction">
                <h2 className="introduction-header">The most ambitious Minecraft build library at your hands</h2>
                <span className="introduction-paragraph">
                    Litematica Library is a place to store,{" "}
                    share and browse all kinds on Minecraft builds and projects.
                    You can download Litematica mod{" "}
                    <a href="https://www.curseforge.com/minecraft/mc-mods/litematica">here</a>.
                </span>
            </div>
            <BuildsRow builds={data || []} heading={<h3>Popular builds right now</h3>}/>
            <style jsx>{`
                .background {
                    min-height: 100vh;
                    width: 100vw;
                }
                
                .banner span {
                    font-size: 0.9em;
                }
                
                .introduction {
                    margin: 6em 5vw;
                }
                
                .introduction-header {
                    margin-bottom: 0.2em;
                }
                
                .introduction-paragraph {
                    
                }
            `}</style>
        </div>
    );
};

export default Home;
