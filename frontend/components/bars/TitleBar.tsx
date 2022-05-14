import theme from "../../constants/theme";
import Link from "next/link";
import Auth from "../../utils/auth";
import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";
import React, { useState } from "react";
import { useRouter } from "next/router";

type ActiveName =
  | "home"
  | "builds"
  | "collections"
  | "creators"
  | "upload"
  | "login"
  | "profile"
  | "favorites"
  | "bookmarks";

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
    router.push("/");
  };

  const NavLink = ({
    href,
    identifier,
    children,
  }: {
    href: string;
    identifier: ActiveName;
    children: React.ReactNode;
  }) => {
    const isActive = identifier === active;

    return (
      <Link href={href}>
        <li
          className={`mx-2.5 ${isActive ? "text-green-600" : "cursor-pointer"}`}
        >
          {children}
        </li>
      </Link>
    );
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between h-14 items-center px-6 font-medium">
        <Link href="/">
          <h1 className="font-black uppercase text-lg cursor-pointer tracking-wide">
            Buildshelf
          </h1>
        </Link>
        <ul className="flex flex-row">
          <NavLink identifier="home" href="/">
            Home
          </NavLink>
          <NavLink identifier="builds" href="/builds">
            Builds
          </NavLink>
          <NavLink identifier="collections" href="/collections">
            Collections
          </NavLink>
          {userObject?.username ? (
            <>
              <NavLink identifier="upload" href="/upload">
                Upload
              </NavLink>
              <div
                className="mx-2.5 cursor-pointer"
                onClick={() => setShowProfileBar((p) => !p)}
              >
                {userObject.username}
                {NBSP}
                <ChevronDown style={{ height: "0.8em" }} />
              </div>
            </>
          ) : (
            <NavLink identifier="login" href="/login">
              Log In
            </NavLink>
          )}
        </ul>
      </div>

      {/*// .profile-bar {*/}
      {/*//   background-color: ${theme.light};*/}
      {/*//   color: ${theme.dark};*/}
      {/*//   z-index: 2;*/}
      {/*//   position: relative;*/}
      {/*//   display: flex;*/}
      {/*//   justify-content: flex-end;*/}
      {/*//   padding: 0 1.2em;*/}
      {/*//   align-items: center;*/}
      {/*//   height: ${showProfileBar ? "2.5em" : 0};*/}
      {/*//   overflow: hidden;*/}
      {/*//   transition: height 100ms linear;*/}
      {/*// }*/}
      <ul
        className={`z-10 relative flex items-center justify-center overflow-hidden ${
          showProfileBar ? "h-14" : "h-0"
        } bg-stone-100`}
      >
        <NavLink href={"/user/" + userObject?.uuid} identifier="profile">
          Builds
        </NavLink>
        <NavLink
          href={"/user/" + userObject?.uuid + "/collections"}
          identifier="collections"
        >
          Collections
        </NavLink>
        <NavLink
          href={"/user/" + userObject?.uuid + "/saves"}
          identifier="favorites"
        >
          Saves
        </NavLink>
        <NavLink
          href={"/user/" + userObject?.uuid + "/bookmarks"}
          identifier="bookmarks"
        >
          Bookmarks
        </NavLink>
        <div onClick={logOut} className="clickable">
          Log out
        </div>
      </ul>

      <div className="background" onClick={() => setShowProfileBar(false)} />
      <style jsx>{`
        // .container {
        //   height: 4em;
        // }
        //
        // .title-bar {
        //   background-color: ${theme.lightHighContrast}${dim ? "77" : "ff"};
        //   color: ${theme.darkHighContrast};
        //   display: flex;
        //   justify-content: space-between;
        //   padding: 0 1.2em;
        //   position: relative;
        //   z-index: 2;
        //   transition: background-color 80ms linear;
        //   border-bottom: 2px solid ${theme.lightMediumContrast};
        //   height: 4em;
        //   align-items: center;
        // }
        //
        // .title {
        //   text-transform: uppercase;
        //   cursor: pointer;
        // }
        //
        // ul {
        //   list-style: none;
        //   margin: 0;
        //   padding: 0;
        //   display: flex;
        //   align-items: center;
        // }
        //
        // .clickable {
        //   display: inline-block;
        //   padding: 0 0.6em;
        //   text-transform: capitalize;
        //   font-size: 0.9em;
        //   font-weight: 500;
        //   text-decoration: none;
        //   cursor: pointer;
        // }
        //
        // .active {
        //   color: ${theme.layoutDark} !important;
        //   cursor: unset !important;
        // }
        //
        .profile {
          //justify-self: flex-end;
          //flex: 1 0 auto;
          //padding: 0.5em 0.6em !important;
          border-radius: 4px;
          transition: background-color 100ms linear, color 100ms linear;

          background-color: ${showProfileBar ? theme.layoutLight : "unset"};
          color: ${showProfileBar ? theme.lightHighContrast : "unset"};
        }
        //
        // .profile-bar {
        //   background-color: ${theme.light};
        //   color: ${theme.dark};
        //   z-index: 2;
        //   position: relative;
        //   display: flex;
        //   justify-content: flex-end;
        //   padding: 0 1.2em;
        //   align-items: center;
        //   height: ${showProfileBar ? "2.5em" : 0};
        //   overflow: hidden;
        //   transition: height 100ms linear;
        // }
        //
        // .background {
        //   display: ${showProfileBar ? "unset" : "none"};
        //   position: fixed;
        //   top: 0;
        //   bottom: 0;
        //   right: 0;
        //   left: 0;
        //   z-index: 1;
        // }
      `}</style>
    </div>
  );
};
export default TitleBar;
