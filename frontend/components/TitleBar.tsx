import theme from "../constants/theme";
import Link from "next/link";
import Auth from "../utils/auth";

const TitleBar = ({ active = null, dim = false }) => {
  const userObject = Auth.getUser();

  const ProfileDropdown = ({ children }) => {
    return (
      <div className="profile-dropdown">
        {children}
        <style jsx>{`
          .profile-dropdown {
            background-color: ${theme.layout};
            border-radius: 999px;
            margin: 0 0.6em;
            cursor: pointer;
          }
          
          .profile-dropdown :global(span) {
            color: ${theme.lightHighContrast} !important;
            padding: 0.2em 0.4em;
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <div className="title-bar">
        <Link href="/">
          <h2 className="title">Litematica Library</h2>
        </Link>
        <ul>
          <Link href="/">
            <a className={active === "home" && "active"}>Home</a>
          </Link>
          <Link href="/builds">
            <a className={active === "builds" && "active"}>Builds</a>
          </Link>
          <Link href="/about">
            <a className={active === "about" && "active"}>About</a>
          </Link>
          {userObject?.username ? (
            <Link href="/upload">
              <a className={active === "upload" && "active"}>Upload</a>
            </Link>
          ) : null}
          {userObject?.username ? (
            <ProfileDropdown>
              <span>
                v {userObject.username}
              </span>
            </ProfileDropdown>
          ) : (
            <Link href="/login">
              <a className={active === "login" && "active"}>Log In</a>
            </Link>
          )}
        </ul>
      </div>
      <style jsx>{`
        .title-bar {
          background-color: ${theme.lightHighContrast}${dim ? "77" : "ff"};
          color: ${theme.darkHighContrast};
          display: flex;
          justify-content: space-between;
          padding: 1em 1.2em;
          position: sticky;
          transition: background-color 80ms linear;
          border-bottom: 2px solid ${theme.lightMediumContrast};
        }

        .title {
          text-transform: uppercase;
          cursor: pointer;
        }

        .separator {
          background-color: ${theme.lightLowContrast}80;
          height: 2px;
          border-radius: 20px;
          margin: 0 1.2em;
          flex-shrink: 0;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
        }

        ul a,
        ul span {
          display: inline-block;
          margin: 0 0.6em;
          text-transform: capitalize;
          font-size: 0.9em;
          font-weight: 500;
          text-decoration: none;
        }

        ul a:hover {
          cursor: pointer;
          text-decoration: underline;
        }

        .active {
          color: ${theme.layout} !important;
          //font-weight: 600;
        }
      `}</style>
    </>
  );
};
export default TitleBar;
