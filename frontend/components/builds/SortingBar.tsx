import theme from "../../theme";

interface Params {
    sortBy: string,
    setSortBy: (string) => void,
    category: string,
    setCategory: (string) => void,
    tags: string[],
    setTags: (tags: string[]) => void,
}

const SortingBar = ({ sortBy = "Top", setSortBy, category, setCategory, tags, setTags }: Params) => {
    return <div className="bar">
        {/*<h2>Top: day | hot | new</h2>*/}
        <div className="dropdowns">
            <h4>Sort: {sortBy}</h4>
            <h4>Category</h4>
            <h4>Contains: tag</h4>
        </div>
        <h4 className="search">
            Search
        </h4>
        <style jsx>
            {`
                .bar {
                    background-color: ${theme.highContrastLight};
                    color: ${theme.lowContrastDark};
                    border-radius: 8px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    box-shadow: 0 0 30px 6px #00000044;
                    align-items: center;
                }
                
                .dropdowns {
                    display: flex;
                    flex-direction: row;
                }
                
                .dropdowns > h4 {
                    padding: 0.8em 1.2em;
                    margin: 0 0.5em;
                    border-left: 1px solid ${theme.highContrastDark};
                    font-size: 0.9em;
                    cursor: pointer;
                }
                
                .dropdowns > h4:first-child {
                    border: none;
                }
                
                .search {
                    margin: 0 0.5em;
                    padding: 0.4em 1.2em;
                    background-color: ${theme.layout};
                    border-radius: 4px;
                    color: ${theme.highContrastLight};
                }
            `}
        </style>
    </div>;
}

export default SortingBar;