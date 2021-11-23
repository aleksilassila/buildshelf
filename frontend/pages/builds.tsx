import TitleBar from "../components/TitleBar";
import theme from "../theme";
import SortingBar from "../components/builds/SortingBar";
import BuildsList from "../containers/BuildsList";
import useAxios from "axios-hooks";

const Builds = () => {
    const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + '/builds/top');

    return (
        <div className="builds">
            <TitleBar />
            <div className="container">
                <h2>Builds</h2>
                <SortingBar />
                <BuildsList builds={data || []} heading={null} />
            </div>
            <style jsx>
                {`
                    .builds {
                        background-color: ${theme.highContrastDark};
                        height: 100vh;
                        width: 100vw;
                    }
                    
                    .container {
                        margin: 2em;
                    }
                `}
            </style>
        </div>
    );
}

export default Builds;
