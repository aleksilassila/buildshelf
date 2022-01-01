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
            className={`${item.unclickable && "unclickable"} ${
              item.active && "active"
            }`}
            key={i}
            onClick={item.onClick}
          >
            {item.content}
          </div>
        ))}
      <style jsx>
        {`
          .multiple-button {
            border: 1px solid ${theme.lightLowContrast};
            background-color: ${theme.lightHighContrast};
            border-radius: 4px;
            height: 2.2rem;
            font-size: 0.9em;

            display: inline-flex;
            flex-direction: row;
            overflow: hidden;
          }

          .multiple-button > * {
            padding: 0.4em 1em;
            border-right: 1px solid ${theme.lightLowContrast};
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .multiple-button > *:not(.unclickable):hover {
            background-color: ${theme.lightMediumContrast};
          }

          .multiple-button > *:last-child {
            border: none;
          }

          .unclickable,
          .active {
            cursor: unset !important;
          }

          .unclickable:active {
            background-color: unset !important;
          }

          .active {
            background-color: ${theme.lightLowContrast} !important;
          }

          .active:active {
            background-color: ${theme.lightLowContrast} !important;
          }
        `}
      </style>
    </div>
  );
};

export default MultipleButton;
