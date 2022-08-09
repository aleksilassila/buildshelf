import { NavLinkContext, useIsHrefActive } from "../navbar/NavLink";
import theme from "../../constants/theme";
import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
import { User } from "../../interfaces/ApiResponses";

interface ProfileNavBarProps {
  user: User;
  isOwnProfile: boolean;
  activeHref?: string;
  count: number;
}

const ProfileNavLink: FunctionComponent<{
  href: string;
  children: ReactNode | ReactNode[];
}> = ({ href, children }) => {
  const active = useIsHrefActive(href);

  return (
    <Link href={href}>
      <span
        className={`font-semibold cursor-pointer py-1 -mb-0.5 border-b-green-500 ${
          active && "border-b-2 text-green-500"
        }`}
      >
        {children}
      </span>
    </Link>
  );
};

const ProfileNavBar = ({
  user,
  isOwnProfile,
  count = null,
  activeHref,
}: ProfileNavBarProps) => {
  const getCount = (t) =>
    activeHref === t && count !== null ? `(${count})` : "";

  return (
    <NavLinkContext.Provider value={activeHref}>
      <div className="flex gap-4 border-b-2 border-stone-300">
        <ProfileNavLink href={"/users/" + user.uuid}>
          Builds {getCount("profile")}
        </ProfileNavLink>
        {/*<ProfileNavLink href={"/users/" + user.uuid + "/collections"}>*/}
        {/*  Collections {getCount("collections")}*/}
        {/*</ProfileNavLink>*/}
        <ProfileNavLink href={"/users/" + user.uuid + "/saves"}>
          Saves {getCount("saves")}
        </ProfileNavLink>
        {isOwnProfile
          ? null
          : // <ProfileNavLink href={"/users/" + user.uuid + "/bookmarks"}>
            //   Bookmarks {getCount("bookmarks")}
            // </ProfileNavLink>
            null}
        <style jsx>
          {`
            .profile-bar {
              display: flex;
              //margin: 0 -0.5em;
              //padding: 0 0 0.5em 0;
              align-items: stretch;
              height: 2em;
              border-bottom: 2px solid ${theme.lightLowContrast};
              margin-bottom: 1em;
            }

            .item {
              font-weight: 600;
              padding: 0 0.5em;
              cursor: pointer;
              margin-bottom: -2px;
            }

            .active {
              color: ${theme.layoutDark};
              border-bottom: 2px solid ${theme.layoutDark};
            }
          `}
        </style>
      </div>{" "}
    </NavLinkContext.Provider>
  );
};

export default ProfileNavBar;
