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

export const NavItem: FunctionComponent<
  { isActive?: boolean } & HTMLAttributes<HTMLLIElement>
> = ({ children, isActive, ...rest }) => (
  <li
    className={`mx-2.5 md:my-0 my-2 text-xl md:text-base font-medium ${
      isActive ? "text-green-500" : "cursor-pointer"
    }`}
    {...rest}
  >
    {children}
  </li>
);

const NavLink: FunctionComponent<
  { href: string } & HTMLAttributes<HTMLDivElement>
> = ({ href, children }) => {
  const isActive = useIsHrefActive(href);

  return (
    <Link href={href}>
      <NavItem isActive={isActive}>{children}</NavItem>
    </Link>
  );
};

export { NavLink, NavLinkContext, useIsHrefActive };
