import { FunctionComponent } from "react";
import Auth from "../../utils/auth";
import { NavLink } from "./NavLink";

export const PrimaryNavbar = ({ children }) => (
  <ul className="flex flex-row items-center hidden md:flex">{children}</ul>
);

type Props = {
  show: boolean;
  logOut: () => void;
};

export const SecondaryNavbar: FunctionComponent<Props> = ({
  show,
  logOut,
  children,
}) => {
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
