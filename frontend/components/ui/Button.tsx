import theme from "../../constants/theme";
import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  mode?: "primary" | "danger" | "disabled" | "label" | "default";
  disabled?: boolean;
  [key: string]: any;
}

const Button = ({ children, className, mode = "default", ...rest }: Props) => {
  if (mode === "disabled" || mode === "label") {
    rest.onClick = () => {};
  }

  return (
    <div
      className={`${theme.ui.spacing} ${theme.ui.borders} ${theme.ui.outline}
          whitespace-nowrap font-medium ${
            {
              primary:
                "text-white bg-green-500 border-0 active:bg-green-600 cursor-pointer",
              danger:
                "text-white bg-red-500 border-red-600 active:bg-red-600 cursor-pointer",
              disabled: "cursor-default opacity-50 bg-white",
              label: "cursor-default bg-white text-stone-700",
              default:
                "cursor-pointer bg-white active:bg-stone-200 text-stone-700",
            }[mode]
          } ${className}`}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Button;
