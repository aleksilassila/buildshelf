import { HTMLAttributes } from "react";

const Separator = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={`bg-stone-200 h-[2px] my-4 rounded-2xl w-auto flex-shrink-0 ${props.className}`}
  />
);

export default Separator;
