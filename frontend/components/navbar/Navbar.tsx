import Link from "next/link";
import Auth from "../../utils/auth";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Styled from "../Styled";
import { NavLink, NavLinkContext } from "./NavLink";
import {
  OverlayNavbar,
  OverlayNavbarSecondary,
} from "./OverlayNavbarContainers";
import { PrimaryNavbar, SecondaryNavbar } from "./NavbarContainers";
import { NavLoginButton } from "./NavLoginButton";
import { ProfileNavButton } from "./ProfileNavButton";

const MainItems = ({ userObject, showSecondary, setShowSecondary }) => (
  <>
    <NavLink href="/">Home</NavLink>
    <NavLink href="/builds">Builds</NavLink>
    {/*<NavLink name="collections" href="/collections">*/}
    {/*  Collections*/}
    {/*</NavLink>*/}
    {userObject.isLoggedIn() ? (
      <>
        <NavLink href="/upload">Upload</NavLink>
        <ProfileNavButton
          setShowNav={setShowSecondary}
          showNav={showSecondary}
          username={userObject?.username}
        />
      </>
    ) : (
      <NavLoginButton />
    )}
  </>
);

const SecondaryItems = ({ uuid, logOut }) => (
  <>
    <NavLink href={"/users/" + uuid}>Builds</NavLink>
    {/*<NavLink href={"/users/" + uuid + "/collections"}>*/}
    {/*  Collections*/}
    {/*</NavLink>*/}
    <NavLink href={"/users/" + uuid + "/saves"}>Saves</NavLink>
    {/*<NavLink href={"/users/" + uuid + "/bookmarks"}>*/}
    {/*  Bookmarks*/}
    {/*</NavLink>*/}
    <div onClick={logOut} className="cursor-pointer">
      Log out
    </div>
  </>
);

const Navbar = ({ active = null }: { active?: string }) => {
  const [showProfileBar, setShowProfileBar] = useState(false);
  const userObject = Auth.getUser();

  const router = useRouter();

  const logOut = () => {
    Auth.setUser(undefined);
    setShowProfileBar(false);
    router.push("/").then();
  };

  const PageName = Styled(
    "font-black uppercase text-lg cursor-pointer tracking-wide"
  );

  return (
    <NavLinkContext.Provider value={active || ""}>
      <div className="font-medium">
        <div className="flex flex-row justify-between h-14 items-center px-6 border-b-2 border-b-stone-200">
          <Link href="/">
            <PageName>Buildshelf</PageName>
          </Link>
          <PrimaryNavbar>
            <MainItems
              userObject={userObject}
              showSecondary={showProfileBar}
              setShowSecondary={setShowProfileBar}
            />
          </PrimaryNavbar>
          <OverlayNavbar>
            <MainItems
              userObject={userObject}
              showSecondary={showProfileBar}
              setShowSecondary={setShowProfileBar}
            />
            <OverlayNavbarSecondary
              setShowSecondary={setShowProfileBar}
              showSecondary={showProfileBar}
            >
              <SecondaryItems uuid={userObject?.uuid} logOut={logOut} />
            </OverlayNavbarSecondary>
          </OverlayNavbar>
        </div>
        <SecondaryNavbar show={showProfileBar} logOut={logOut}>
          <SecondaryItems uuid={userObject?.uuid} logOut={logOut} />
        </SecondaryNavbar>
        {/*<div className="background" onClick={() => setShowProfileBar(false)} />*/}
      </div>
    </NavLinkContext.Provider>
  );
};

export default Navbar;
