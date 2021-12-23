import theme from "../../constants/theme";

export interface TableData {
  rows: ({
    content: JSX.Element,
  } | null)[][],
  horizontalBorders: boolean,
  verticalBorders: boolean,
}

const Table = ({ data }: { data: TableData }) => {
  let width = 0;
  data.rows.forEach((row, index) => {
    data.rows[index] = row.filter((item) => item !== null);
    width = data.rows[index].length > width ? data.rows[index].length : width;
  });

  return (
    <table className="container">
      {data.rows.map((row, i) => (
        <tr>
          {row.map((item) => (
            <td>{item.content}</td>
          ))}
        </tr>
      ))}
      <style jsx>
        {`
          table {
            border: 1px solid ${theme.lowContrastLight};
            background-color: ${theme.highContrastLight};
            border-radius: 4px;
            font-size: 0.9em;
            border-spacing: 0;
            width: 100%;
          }

          tr > * {
            padding: 0.4em 1em;
            cursor: pointer;
            border-bottom: ${data.horizontalBorders ? `1px solid ${theme.lowContrastLight}` : "none"};
            border-right: ${data.verticalBorders ? `1px solid ${theme.lowContrastLight}` : "none"};
          }
          
          tr:last-child > * {
            border-bottom: none;
          }

          tr > *:last-child {
            border-right: none;
          }
        `}
      </style>
    </table>
  );
};

export default Table;
