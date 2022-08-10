import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { NavItem, NavLink, NavLinkContext } from "./NavLink";
import { LoginButton } from "./LoginButton";
import { ProfileNavButton } from "./ProfileNavButton";
import { storeLocalUser, useLocalUser } from "../../utils/auth";
import AwesomeIcon from "../icons/AwesomeIcon";
import { motion } from "framer-motion";
import Router from "next/router";

const NavBackground = () => (
  <div className="flex items-center px-6 border-b-2 border-b-stone-200 col-start-1 col-span-2 row-start-1">
    <Link href="/">
      <div className="font-black uppercase text-lg cursor-pointer tracking-wide">
        Buildshelf
      </div>
    </Link>
  </div>
);

const PrimaryNav = ({ children }) => {
  return (
    <ul
      className={`md:flex-row flex flex-col md:gap-0 items-center col-start-2 row-start-1 justify-self-end px-6`}
    >
      {children}
    </ul>
  );
};

const SecondaryNav = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: ReactNode[];
}) => {
  return (
    <motion.ul
      animate={isVisible ? "visible" : "hidden"}
      initial={false}
      variants={{
        visible: { height: "auto" },
        hidden: { height: 0 },
      }}
      transition={{ duration: 0.15 }}
      className={`self-stretch bg-stone-100 md:flex-row flex-col relative flex items-center justify-end
      overflow-hidden px-6 col-start-1 col-span-2 row-start-2`}
    >
      {children}
    </motion.ul>
  );
};

interface LinksContainerProps {
  children: ReactNode[];
  showPrimary: boolean;
  setShowPrimary: (showPrimary: boolean) => void;
}

const LinksContainer = ({
  children,
  showPrimary,
  setShowPrimary,
}: LinksContainerProps) => (
  <>
    <div className="hidden md:grid grid-rows-[100%_3rem] col-start-1 row-start-1 col-span-2 row-span-2">
      {children}
    </div>
    <div
      className={`${
        showPrimary ? "flex" : "hidden"
      } md:hidden fixed top-0 right-0 w-full h-full flex-col justify-center items-center bg-white z-50`}
    >
      <div
        className="fixed top-4 right-4 w-10 h-10 cursor-pointer flex items-center justify-center"
        onClick={() => setShowPrimary(false)}
      >
        <AwesomeIcon className={"w-5 h-5"} icon="faXmark" />
      </div>
      {children}
    </div>
  </>
);

const Navbar = ({ active = null }: { active?: string }) => {
  const [showSecondary, setShowSecondary] = useState(false);
  const [showPrimary, setShowPrimary] = useState(false);
  const localUser = useLocalUser();

  const logOut = () => {
    storeLocalUser(null);
    setShowSecondary(false);
    Router.replace("/").then(() => Router.reload());
  };

  return (
    <NavLinkContext.Provider value={active || ""}>
      <div className="grid grid-cols-2 grid-rows-1 h-16">
        <NavBackground />
        <div
          className={`h-9 w-9 mx-6 flex justify-center items-center cursor-pointer text-xl md:hidden col-start-2 row-start-1 self-center justify-self-end`}
          onClick={() => setShowPrimary((p) => !p)}
        >
          <AwesomeIcon icon="faBars" />
        </div>
        <LinksContainer
          showPrimary={showPrimary}
          setShowPrimary={setShowPrimary}
        >
          <PrimaryNav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/builds">Builds</NavLink>
            {/*<NavLink name="collections" href="/collections">*/}
            {/*  Collections*/}
            {/*</NavLink>*/}
            {localUser.isLoggedIn() ? (
              <>
                <NavLink href="/upload">Upload</NavLink>
                <ProfileNavButton
                  setShowSecondary={setShowSecondary}
                  showSecondary={showSecondary}
                  username={localUser?.username}
                />
              </>
            ) : (
              <LoginButton />
            )}
          </PrimaryNav>
          <SecondaryNav isVisible={showSecondary}>
            <NavLink href={"/users/" + localUser?.uuid}>Builds</NavLink>
            {/*<NavLink href={"/users/" + localUser?.uuid + "/collections"}>*/}
            {/*  Collections*/}
            {/*</NavLink>*/}
            <NavLink href={"/users/" + localUser?.uuid + "/saves"}>
              Saves
            </NavLink>
            {/*<NavLink href={"/users/" + localUser?.uuid + "/bookmarks"}>*/}
            {/*  Bookmarks*/}
            {/*</NavLink>*/}
            <NavItem onClick={logOut}>Log out</NavItem>
          </SecondaryNav>
        </LinksContainer>
      </div>
    </NavLinkContext.Provider>
  );
};

export default Navbar;
