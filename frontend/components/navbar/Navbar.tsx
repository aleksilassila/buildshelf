import theme from "../../constants/theme";
import Link from "next/link";
import Auth from "../../utils/auth";
import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";
import React, { useState } from "react";
import { useRouter } from "next/router";
import * as AlertDialog from "../ui/AlertDialog";
import Button from "../ui/Button";
import Styled from "../Styled";
import SecondaryNavbar from "./SecondaryNavbar";
import { NavLink, NavLinkContext } from "./NavLink";
import NavLinks from "./NavLinks";
import NavLinksMobile, { SecondaryMobileMenu } from "./NavLinksMobile";

const MainItems = ({ userObject }) => (
  <>
    <NavLink href="/">Home</NavLink>
    <NavLink href="/builds">Builds</NavLink>
    {/*<NavLink name="collections" href="/collections">*/}
    {/*  Collections*/}
    {/*</NavLink>*/}
    {userObject.isLoggedIn() ? (
      <>
        <NavLink href="/upload">Upload</NavLink>
      </>
    ) : (
      <LoginButton />
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

const ProfileNavButton = ({ showNav, setShowNav, username }) => (
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
          <NavLinks>
            <MainItems userObject={userObject} />
            <ProfileNavButton
              setShowNav={setShowProfileBar}
              showNav={showProfileBar}
              username={userObject?.username}
            />
          </NavLinks>
          <NavLinksMobile>
            <MainItems userObject={userObject} />
            <SecondaryMobileMenu
              setShowSecondary={setShowProfileBar}
              showSecondary={showProfileBar}
            >
              <SecondaryItems uuid={userObject?.uuid} logOut={logOut} />
            </SecondaryMobileMenu>
          </NavLinksMobile>
        </div>
        <SecondaryNavbar show={showProfileBar} logOut={logOut} />
        {/*<div className="background" onClick={() => setShowProfileBar(false)} />*/}
      </div>
    </NavLinkContext.Provider>
  );
};

const LoginButton = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <div className="mx-2.5 cursor-pointer">Log In</div>
    </AlertDialog.Trigger>
    <AlertDialog.Content className="flex flex-col gap-6">
      <div>
        <h2 className={theme.text.display}>Log in</h2>
        <p className={theme.text.body}>Log in with a Minecraft account</p>
      </div>
      <div className="flex justify-between">
        <AlertDialog.Action>
          <a
            href={`https://login.live.com/oauth20_authorize.srf?client_id=e74b6ce2-9270-4f94-9bbb-8d7e9afb9a0f&scope=XboxLive.signin%20offline_access&redirect_uri=${process.env.FRONTEND_ENDPOINT}/login&response_type=code`}
          >
            <Button mode="primary" className="w-min">
              Log in via Microsoft
            </Button>
          </a>
        </AlertDialog.Action>
        <AlertDialog.Cancel>
          <Button>Cancel</Button>
        </AlertDialog.Cancel>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

export default Navbar;
