import { FunctionComponent, HTMLAttributes } from "react";

export const PrimaryNavbar = ({ children }) => (
  <ul className="flex flex-row items-center hidden md:flex">{children}</ul>
);

type Props = {
  show: boolean;
};

export const SecondaryNavbar: FunctionComponent<
  Props & HTMLAttributes<HTMLDivElement>
> = ({ show, children }) => {
  return (
    <ul
      className={`z-10 relative hidden md:flex items-center justify-end overflow-hidden ${
        show ? "h-12" : "h-0"
      } bg-stone-100 px-6 transition-all duration-100 ease-linear`}
    >
      {children}
    </ul>
  );
};
