import theme from "../../constants/theme";
import Dropdown from "../forms/Dropdown";
import { useState } from "react";

const SortDropdown = ({ setSortBy, sortBy }) => (
  <div>
    <Dropdown
      items={["Popular", "Top", "New"].map((el, i) => (
        <span key={i} className="sort-list-item" onClick={() => setSortBy(el)}>
          {el}
        </span>
      ))}
    >
      <span className="sort-button-content">{sortBy}</span>
    </Dropdown>
    <style jsx>{`
      .sort-button-content {
        font-weight: 600;
        font-size: 0.9em;
        color: ${theme.lowContrastDark};
      }

      .sort-list-item {
        padding: 0.4em 1em;
        font-size: 0.9em;
      }

      .sort-list-item:hover {
        cursor: pointer;
        background-color: ${theme.lowContrastLight};
      }

      .sort-list-item:first-child {
        border-radius: 4px 4px 0 0;
      }

      .sort-list-item:last-child {
        border-radius: 0 0 4px 4px;
      }
    `}</style>
  </div>
);

const SearchField = ({ doSearch }) => {
  const [value, setValue] = useState("");
  return (
    <div className="container">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search builds by title"
        onBlur={() => doSearch(value)}
        onKeyUp={(e) => e.key === "Enter" && doSearch(value)}
      />
      <style jsx>{`
        input {
          border: 1px solid ${theme.lowContrastLight};
          padding: 0.4em 1em;
          font-size: 0.96em;
          border-radius: 4px;
          appearance: none;
          height: 2.2rem;
        }

        input:hover,
        input:focus {
          background-color: ${theme.lowContrastLight};
          color: ${theme.lowContrastDark};
          outline: none;
        }
      `}</style>
    </div>
  );
};

const FilterToggle = ({ toggled, setToggled }) => {
  return (
    <div className="container" onClick={() => setToggled(!toggled)}>
      <span className="filter-button-content">Filters</span>
      <style jsx>{`
        .container {
          border: 1px solid ${theme.lowContrastLight};
          padding: 0.4em 1em;
          font-size: 0.96em;
          border-radius: 4px;
          cursor: pointer;
          background-color: ${toggled
            ? theme.lowContrastLight
            : theme.highContrastLight};
        }

        .container:active {
          //background-color: ${theme.lowContrastLight};
          color: ${theme.lowContrastDark};
          border: 1px solid ${theme.lowContrastDark};
        }

        .filter-button-content {
        }
      `}</style>
    </div>
  );
};

const SortingBar = ({
  sortBy,
  setSortBy,
  filtersToggled,
  setFiltersToggled,
  doSearch,
}) => {
  return (
    <div className="bar">
      <div className="left">
        <div className="space">
          <SortDropdown setSortBy={setSortBy} sortBy={sortBy} />
        </div>
        <SearchField doSearch={doSearch} />
      </div>
      <FilterToggle toggled={filtersToggled} setToggled={setFiltersToggled} />
      <style jsx>
        {`
          .bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1em;
          }

          .space {
            margin-right: 0.5em;
          }

          .left {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};

export default SortingBar;
