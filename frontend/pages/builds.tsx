import TitleBar from "../components/TitleBar";
import theme from "../constants/theme";
import SortingBar from "../components/builds/SortingBar";
import BuildsList from "../containers/BuildsList";
import useAxios from "axios-hooks";
import {useEffect, useState} from "react";
import axios from "axios";
import ErrorText from "../components/statuses/ErrorText";
import messages from "../constants/messages";
import SplashText from "../components/statuses/SplashText";

const Empty = () => <span>
    It's quite empty here.
    <style jsx>{`
        span {
          color: ${theme.lowContrastDark}88;
          font-size: 0.9em;
        }
    `}</style>
</span>


const Builds = () => {
    const [sortBy, setSortBy] = useState<"Popular" | "Top" | "New">("Top");
    const [searchTerm, setSearchTerm] = useState("");
    const [filtersToggled, setFiltersToggled] = useState(false);

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching builds...");

        const params = {
            sort: sortBy === "Popular" ? "top" : sortBy.toLocaleLowerCase(),
        }

        if (searchTerm.length) {
            params.title = searchTerm;
        }

        axios.get(process.env.BACKEND_ENDPOINT + "/builds/get", { params })
            .then(res => setData(res.data || []))
            .catch(setError);
    }, [sortBy, searchTerm]);

    const doSearch = (term: string) => {
        if (term !== searchTerm) {
            setSearchTerm(term);
        }
    }

    return (
        <div className="builds">
            <TitleBar active="builds" />
            <div className="container">
                <SortingBar
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    filtersToggled={filtersToggled}
                    setFiltersToggled={setFiltersToggled}
                    doSearch={doSearch} />
                <div className="content">
                    {error ? <ErrorText><h2>{messages.errorTitle}</h2><p>{messages.errorFetch("builds")}</p></ErrorText> :
                        !data ? <SplashText><p>{messages.loading}</p></SplashText> :
                            data?.length === 0 ? <Empty /> : <BuildsList builds={data} heading={null} />}
                </div>
            </div>
            <style jsx>
                {`
                    .builds {
                        background-color: ${theme.highContrastLight};
                        height: 100vh;
                        width: 100vw;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .container {
                        padding: 2em;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .content {
                      flex-grow: 1;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                `}
            </style>
        </div>
    );
}

export default Builds;
