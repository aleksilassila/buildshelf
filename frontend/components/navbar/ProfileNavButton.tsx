import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";

export const ProfileNavButton = ({ showNav, setShowNav, username }) => (
  <>
    <span
      className="text-center md:hidden"
      onClick={(e) => {
        e.stopPropagation();
        setShowNav((p) => !p);
      }}
    >
      {username}
    </span>
    <div
      className={`cursor-pointer ${
        showNav ? "bg-green-400 text-slate-50" : "bg-none"
      } rounded-md px-2.5 py-1.5 md:block hidden`}
      onClick={() => setShowNav((p) => !p)}
    >
      {username}
      {NBSP}
      <ChevronDown style={{ height: "0.8em" }} />
    </div>
  </>
);
