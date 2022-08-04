import {
  createContext,
  FunctionComponent,
  HTMLAttributes,
  useContext,
} from "react";
import Link from "next/link";

const NavLinkContext = createContext<string>("");

const useIsHrefActive = (href: string) => {
  const active = useContext(NavLinkContext);
  return active === href;
};

const NavLink: FunctionComponent<
  { href: string } & HTMLAttributes<HTMLDivElement>
> = ({ href, children }) => {
  const isActive = useIsHrefActive(href);

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

export { NavLink, NavLinkContext, useIsHrefActive };
