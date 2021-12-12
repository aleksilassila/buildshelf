import TitleBar from "../components/TitleBar";
import theme from "../theme";
import SortingBar from "../components/builds/SortingBar";
import BuildsList from "../containers/BuildsList";
import useAxios from "axios-hooks";
import {useEffect, useState} from "react";
import axios from "axios";

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
            .catch(err => {});
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
                {data?.length === 0 ? <Empty /> : <BuildsList builds={data || []} heading={null} />}
            </div>
            <style jsx>
                {`
                    .builds {
                        background-color: ${theme.highContrastLight};
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
