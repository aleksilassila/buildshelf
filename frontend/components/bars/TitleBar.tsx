import theme from "../../constants/theme";
import Link from "next/link";
import Auth from "../../utils/auth";
import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";
import { useState } from "react";
import { useRouter } from 'next/router';

const TitleBar = ({ active = null, dim = false }) => {
  const [showProfileBar, setShowProfileBar] = useState(false);
  const userObject = Auth.getUser();

  const router = useRouter();

  const logOut = () => {
    Auth.setUser(undefined);
    router.push("/")
  }

  return (
    <div className="container">
      <div className="title-bar">
        <Link href="/">
          <h2 className="title">Litematica Library</h2>
        </Link>
        <ul>
          <Link href="/">
            <div className={`${active === "home" && "active"} clickable`}>
              Home
            </div>
          </Link>
          <Link href="/builds">
            <div className={`${active === "builds" && "active"} clickable`}>
              Builds
            </div>
          </Link>
          <Link href="/collections">
            <div
              className={`${active === "collections" && "active"} clickable`}
            >
              Collections
            </div>
          </Link>
          <Link href="/creators">
            <div className={`${active === "creators" && "active"} clickable`}>
              Creators
            </div>
          </Link>
          <Link href="/about">
            <div className={`${active === "about" && "active"} clickable`}>
              About
            </div>
          </Link>
          {userObject?.username ? (
            <Link href="/upload">
              <div className={`${active === "upload" && "active"} clickable`}>
                Upload
              </div>
            </Link>
          ) : null}
          {userObject?.username ? (
            <div
              className={`${active === "about" && "active"} profile clickable`}
              onClick={() => setShowProfileBar((p) => !p)}
            >
              {userObject.username}
              {NBSP}
              <ChevronDown style={{ height: "0.8em" }} />
            </div>
          ) : (
            <Link href="/login">
              <div className={`${active === "login" && "active"} clickable`}>
                Log In
              </div>
            </Link>
          )}
        </ul>
      </div>
      <div className="profile-bar">
        <Link href="/">
          <div className={`${active === "" && "active"} clickable`}>
            Profile
          </div>
        </Link>
        <Link href="/">
          <div className={`${active === "" && "active"} clickable`}>
            Favorites
          </div>
        </Link>
        <div onClick={logOut} className={`${active === "" && "active"} clickable`}>Log out</div>
      </div>
      <div className="background" onClick={() => setShowProfileBar(false)} />
      <style jsx>{`
        .container {
          height: 4em;
        }

        .title-bar {
          background-color: ${theme.lightHighContrast}${dim ? "77" : "ff"};
          color: ${theme.darkHighContrast};
          display: flex;
          justify-content: space-between;
          padding: 0 1.2em;
          position: relative;
          z-index: 2;
          transition: background-color 80ms linear;
          border-bottom: 2px solid ${theme.lightMediumContrast};
          height: 4em;
          align-items: center;
        }

        .title {
          text-transform: uppercase;
          cursor: pointer;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .clickable {
          display: inline-block;
          padding: 0 0.6em;
          text-transform: capitalize;
          font-size: 0.9em;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
        }

        .active {
          color: ${theme.layoutDark} !important;
          cursor: unset !important;
        }

        .profile {
          justify-self: flex-end;
          flex: 1 0 auto;
          padding: 0.5em 0.6em !important;
          border-radius: 4px;
          transition: background-color 100ms linear, color 100ms linear;

          background-color: ${showProfileBar ? theme.layoutLight : "unset"};
          color: ${showProfileBar ? theme.lightHighContrast : "unset"};
        }

        .profile-bar {
          background-color: ${theme.light};
          color: ${theme.dark};
          z-index: 2;
          position: relative;
          display: flex;
          justify-content: flex-end;
          padding: 0 1.2em;
          align-items: center;
          height: ${showProfileBar ? "2.5em" : 0};
          overflow: hidden;
          transition: height 100ms linear;
        }

        .background {
          display: ${showProfileBar ? "unset" : "none"};
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};
export default TitleBar;
