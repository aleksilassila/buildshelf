import TitleBar from "../components/TitleBar";
import theme from "../theme";
import BuildsList from "../containers/BuildsList";
import useAxios from "axios-hooks";
import InfoBox from "../components/InfoBox";

const Home = () => {
    const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + '/builds/top');
    return (
        <div className={'background'}>
            <TitleBar />
            <InfoBox>
                <h3 className="info-box-heading">Welcome to Litematica Library</h3>
                <span>A Place to Store, Browse and Share Litematica Builds. You can download Litematica mod{" "}
                    <a href="https://www.curseforge.com/minecraft/mc-mods/litematica">here</a>.</span>
            </InfoBox>

            <BuildsList builds={data || []} heading={<h3>Popular builds right now</h3>}/>

            <style jsx>{`
                .background {
                    background-color: ${theme.highContrastDark};
                    min-height: 100vh;
                    width: 100vw;
                }
                
                .banner span {
                    font-size: 0.9em;
                }
            `}</style>
        </div>
    );
};

export default Home;
