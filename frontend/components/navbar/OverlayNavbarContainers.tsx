import AwesomeIcon from "../icons/AwesomeIcon";
import { useState } from "react";

export const OverlayNavbar = ({ children }) => {
  const [showPrimary, setShowPrimary] = useState(false);

  return (
    <div
      className={`md:hidden h-9 w-9 flex justify-center items-center cursor-pointer text-xl`}
      onClick={() => setShowPrimary((p) => !p)}
    >
      <AwesomeIcon icon="faBars" />
      <ul
        className="fixed top-0 right-0 w-full h-full flex flex-col justify-center items-center gap-4 bg-white z-50"
        style={{
          display: showPrimary ? "flex" : "none",
        }}
      >
        {children}
      </ul>
    </div>
  );
};

export const OverlayNavbarSecondary = ({ children, showSecondary }) => {
  return (
    <div
      className={`md:hidden flex flex-col gap-2 self-stretch`}
      onClick={(e) => e.stopPropagation()}
    >
      <ul
        className={`overflow-hidden flex flex-col gap-2 items-center bg-stone-100 transition-all duration-200 ease-linear ${
          showSecondary ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="my-2 flex flex-col gap-2 items-center">{children}</div>
      </ul>
    </div>
  );
};
