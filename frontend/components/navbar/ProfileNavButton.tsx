import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";
import { NavItem } from "./NavLink";

export const ProfileNavButton = ({
  showSecondary,
  setShowSecondary,
  username,
}) => (
  <>
    <NavItem
      className={"md:hidden"}
      onClick={(e) => {
        e.stopPropagation();
        setShowSecondary((p) => !p);
      }}
    >
      {username}
    </NavItem>
    <div
      className={`cursor-pointer ${
        showSecondary ? "bg-green-400 text-slate-50" : "bg-none"
      } rounded-md px-2.5 py-1.5 md:block hidden font-medium`}
      onClick={() => setShowSecondary((p) => !p)}
    >
      {username}
      {NBSP}
      <ChevronDown style={{ height: "0.8em" }} />
    </div>
  </>
);
