import { FunctionComponent, HTMLAttributes } from "react";

type Props = {
  src: string;
};

export const ImageIcon = (props: Props & HTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src={props.src}
      className={`h-[1em] w-[1em] inline mx-2 ${props.className}`}
      alt=""
    />
  );
};
