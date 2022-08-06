import Separator from "../utils/Separator";
import { HTMLAttributes } from "react";

const SortingBar = ({ children }) => {
  return <div className="flex justify-between items-center">{children}</div>;
};

const SortingBarHalf = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`flex items-center gap-2 ${props.className}`}>
      {props.children}
    </div>
  );
};

export { SortingBar, SortingBarHalf };
