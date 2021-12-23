import theme from "../../constants/theme";

export interface MultipleButtonData {
  content: JSX.Element;
  onClick?: () => void;
  unclickable?: boolean;
  active?: boolean;
}

const MultipleButton = ({ data }: { data: (MultipleButtonData | null)[] }) => {
  return (
    <div className="multiple-button">
      {data
        .filter((i) => i !== null)
        .map((item, i) => (
          <div
            className={`${item.unclickable && "unclickable"} ${item.active && "active"}`}
            key={i}
            onClick={item.onClick}
          >
            {item.content}
          </div>
        ))}
      <style jsx>
        {`
          .multiple-button {
            border: 1px solid ${theme.lowContrastLight};
            background-color: ${theme.highContrastLight};
            border-radius: 4px;
            height: 2.3em;
            font-size: 0.9em;

            display: inline-flex;
            flex-direction: row;
          }

          .multiple-button > * {
            padding: 0.4em 1em;
            border-right: 1px solid ${theme.lowContrastLight};
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .multiple-button > *:active {
            background-color: ${theme.mediumContrastLight};
          }

          .multiple-button > *:last-child {
            border: none;
          }

          .unclickable, .active {
            cursor: unset !important;
          }

          .unclickable:active {
            background-color: unset !important;
          }
          
          .active {
            background-color: ${theme.lowContrastLight} !important;
          }
          
          .active:active {
            background-color: ${theme.lowContrastLight} !important;
          }
        `}
      </style>
    </div>
  );
};

export default MultipleButton;
