import theme from "../../constants/theme";
import Link from "next/link";
import Auth from "../../utils/auth";
import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";
import React, { useState } from "react";
import { useRouter } from "next/router";
import * as AlertDialog from "../ui/AlertDialog";
import Button from "../ui/Button";

export type ActiveName = ActiveMain | ActiveSub;

export type ActiveMain =
  | "home"
  | "builds"
  | "collections"
  | "creators"
  | "upload"
  | "login";

export type ActiveSub = "profile" | "user-collections" | "saves" | "bookmarks";

const TitleBar = ({
  active = null,
  dim = false,
}: {
  active?: ActiveName;
  dim?: boolean;
}) => {
  const [showProfileBar, setShowProfileBar] = useState(false);
  const userObject = Auth.getUser();

  const router = useRouter();

  const logOut = () => {
    Auth.setUser(undefined);
    setShowProfileBar(false);
    router.push("/").then();
  };

  const NavLink = ({
    href,
    name,
    children,
  }: {
    href: string;
    name: ActiveName;
    children: React.ReactNode;
  }) => {
    const isActive = name === active;

    return (
      <Link href={href}>
        <li
          className={`mx-2.5 ${isActive ? "text-green-500" : "cursor-pointer"}`}
        >
          {children}
        </li>
      </Link>
    );
  };

  return (
    <div className="font-medium">
      <div className="flex flex-row justify-between h-14 items-center px-6">
        <Link href="/">
          <h1 className="font-black text-lime-800 uppercase text-lg cursor-pointer tracking-wide">
            Buildshelf
          </h1>
        </Link>
        <ul className="flex flex-row items-center">
          <NavLink name="home" href="/">
            Home
          </NavLink>
          <NavLink name="builds" href="/builds">
            Builds
          </NavLink>
          {/*<NavLink name="collections" href="/collections">*/}
          {/*  Collections*/}
          {/*</NavLink>*/}
          {userObject?.username ? (
            <>
              <NavLink name="upload" href="/upload">
                Upload
              </NavLink>
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
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <div className="mx-2.5 cursor-pointer">Log In</div>
              </AlertDialog.Trigger>
              <AlertDialog.Content className="flex flex-col gap-6">
                <div>
                  <h2 className={theme.text.display}>Log in</h2>
                  <p className={theme.text.body}>
                    Log in with a Minecraft account
                  </p>
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
          )}
        </ul>
      </div>
      <ul
        className={`z-10 relative flex items-center justify-end overflow-hidden ${
          showProfileBar ? "h-12" : "h-0"
        } bg-stone-100 px-6 border-t-2 border-t-stone-200 transition-all duration-100 ease-linear`}
      >
        <NavLink href={"/users/" + userObject?.uuid} name="profile">
          Builds
        </NavLink>
        <NavLink
          href={"/users/" + userObject?.uuid + "/collections"}
          name="user-collections"
        >
          Collections
        </NavLink>
        <NavLink href={"/users/" + userObject?.uuid + "/saves"} name="saves">
          Saves
        </NavLink>
        <NavLink
          href={"/users/" + userObject?.uuid + "/bookmarks"}
          name="bookmarks"
        >
          Bookmarks
        </NavLink>
        <div onClick={logOut} className="cursor-pointer">
          Log out
        </div>
      </ul>

      <div className="background" onClick={() => setShowProfileBar(false)} />
      <style jsx>{`
        .profile {
          border-radius: 4px;
          transition: background-color 100ms linear, color 100ms linear;

          background-color: ${showProfileBar ? theme.layoutLight : "unset"};
          color: ${showProfileBar ? theme.lightHighContrast : "unset"};
        }
      `}</style>
    </div>
  );
};
export default TitleBar;
