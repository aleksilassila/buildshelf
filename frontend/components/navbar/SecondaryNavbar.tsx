import { FunctionComponent } from "react";
import Auth from "../../utils/auth";
import { NavLink } from "./NavLink";

type Props = {
  show: boolean;
  logOut: () => void;
};

const SecondaryNavbar: FunctionComponent<Props> = ({ show, logOut }) => {
  const userObject = Auth.getUser();

  if (!userObject.isLoggedIn()) {
    return <div />;
  }

  return (
    <ul
      className={`z-10 relative flex items-center justify-end overflow-hidden ${
        show ? "h-12" : "h-0"
      } bg-stone-100 px-6 border-t-2 border-t-stone-200 transition-all duration-100 ease-linear`}
    >
      <NavLink href={"/users/" + userObject?.uuid}>Builds</NavLink>
      {/*<NavLink href={"/users/" + userObject?.uuid + "/collections"}>*/}
      {/*  Collections*/}
      {/*</NavLink>*/}
      <NavLink href={"/users/" + userObject?.uuid + "/saves"}>Saves</NavLink>
      {/*<NavLink href={"/users/" + userObject?.uuid + "/bookmarks"}>*/}
      {/*  Bookmarks*/}
      {/*</NavLink>*/}
      <div onClick={logOut} className="cursor-pointer">
        Log out
      </div>
    </ul>
  );
};

export default SecondaryNavbar;
