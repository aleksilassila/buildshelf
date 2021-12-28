import theme from "../../constants/theme";
import {useEffect, useState} from "react";

export interface TableData {
  rows: ({
    content: JSX.Element,
  } | null)[][],
  horizontalBorders?: boolean,
  verticalBorders?: boolean,
}

const Table = ({ data }: { data: TableData }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let _width = 0;

    data.rows.forEach((row, index) => {
      data.rows[index] = row.filter((item) => item !== null);
      _width = data.rows[index].length > _width ? data.rows[index].length : _width;
    });

    setWidth(_width);
  }, [data]);

  if (!data.rows?.length) return null;

  return (
    <div className="table">
      {data.rows.map((row, rowI) =>
        row.map((item, columnI) => (
            <div className="item" key={rowI + "" + columnI}>{item.content}</div>
          ))
      )}
      <style jsx>
        {`
          .table {
            display: grid;
            grid-template-columns: repeat(${width}, 1fr);
            border-radius: 4px;
            font-size: 0.9em;
            width: 100%;
            border: 1px solid ${theme.lightLowContrast};
          }
          
          .table > .item {
            padding: 0.4em 1em;
            display: flex;
            align-items: center;
            border-bottom: ${data.horizontalBorders !== false ? `1px solid ${theme.lightLowContrast}` : "none"};
            border-right: ${data.verticalBorders !== false ? `1px solid ${theme.lightLowContrast}` : "none"};
            overflow: hidden;
          }
          
          .table > .item:nth-last-child(-n + ${width}) {
            border-bottom: none !important;
          }
          
          .item:nth-child(${width}n) {
            border-right: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default Table;
