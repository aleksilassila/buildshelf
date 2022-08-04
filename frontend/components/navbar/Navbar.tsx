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

const Navbar = ({ active = null }: { active: string }) => {
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
    <NavLinkContext.Provider value={active}>
      <div className="font-medium">
        <div className="flex flex-row justify-between h-14 items-center px-6">
          <Link href="/frontend/pages">
            <PageName>Buildshelf</PageName>
          </Link>
          <ul className="flex flex-row items-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/builds">Builds</NavLink>
            {/*<NavLink name="collections" href="/collections">*/}
            {/*  Collections*/}
            {/*</NavLink>*/}
            {userObject.isLoggedIn() ? (
              <>
                <NavLink href="/upload">Upload</NavLink>
                <div
                  className={`cursor-pointer ${
                    showProfileBar ? "bg-green-400 text-slate-50" : "bg-none"
                  } rounded-md px-2.5 py-1.5`}
                  onClick={() => setShowProfileBar((p) => !p)}
                >
                  {userObject.username}
                  {NBSP}
                  <ChevronDown style={{ height: "0.8em" }} />
                </div>
              </>
            ) : (
              <LoginButton />
            )}
          </ul>
        </div>
        <SecondaryNavbar show={showProfileBar} logOut={logOut} />
        <div className="background" onClick={() => setShowProfileBar(false)} />
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
