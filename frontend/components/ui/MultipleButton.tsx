import theme from "../../constants/theme";
import PrimaryButton, { ButtonProps } from "./button/Button";
import { FunctionComponent, HTMLAttributes, ReactNode } from "react";

export const ButtonGroupRoot = ({ children }) => {
  return (
    <div
      className={`${theme.ui.borders} overflow-hidden w-max flex items-stretch h-10 bg-white font-medium divide-x divide-stone-300`}
    >
      {children}
    </div>
  );
};

export const ButtonGroupItem = (props: {
  children: ReactNode;
  className?: string;
  [p: string]: any;
}) => (
  // <div className="px-4 py-0 max-h-full flex items-center w-max">{children}</div>
  <PrimaryButton
    {...props}
    style={{ borderRadius: 0, ...props.style }}
    className={
      "border-0 focus:ring-0 focus-within:ring-0 ring-offset-0 " +
      props.className
    }
  >
    {props.children}
  </PrimaryButton>
);

export const ButtonGroupCustomItem = (
  props: {
    Component: FunctionComponent<ButtonProps>;
    [key: string]: any;
  } & HTMLAttributes<any>
) => (
  <props.Component
    {...props}
    style={{ borderRadius: 0, ...props.style }}
    className={
      "border-0 focus:ring-0 focus-within:ring-0 ring-offset-0 " +
      props.className
    }
  >
    {props.children}
  </props.Component>
);
