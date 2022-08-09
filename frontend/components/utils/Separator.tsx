import theme from "../../constants/theme";
import { HTMLAttributes } from "react";

export const SeparatorTag = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={`bg-stone-200 h-[2px] my-4 rounded-2xl w-auto flex-shrink-0 ${props.className}`}
  >
    <style jsx>
      {`
        .separator {
          background-color: ${theme.lightLowContrast}80;
          height: 2px;
          margin: 1em 0;
          border-radius: 20px;
          width: auto;
          flex-shrink: 0;
        }
      `}
    </style>
  </div>
);

export default <SeparatorTag />;
