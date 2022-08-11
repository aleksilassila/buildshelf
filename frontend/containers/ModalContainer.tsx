import { DivComponent } from "../interfaces/Props";
import { MouseEventHandler } from "react";

interface ComponentProps extends DivComponent {
  onBackgroundClick?: MouseEventHandler<HTMLDivElement>;
  show: boolean;
}

export const ModalContainer = ({
  children,
  className,
  onBackgroundClick,
  show,
  ...rest
}: ComponentProps) => (
  <div
    {...rest}
    className={`fixed top-0 left-0 z-50 bg-[#00000088] w-screen h-screen ${
      show ? "block" : "hidden"
    } ${className}`}
    onClick={onBackgroundClick}
  >
    {children}
  </div>
);
