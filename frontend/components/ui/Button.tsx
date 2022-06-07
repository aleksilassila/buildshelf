import theme from "../../constants/theme";
import React, { useState } from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  mode?: "primary" | "danger" | "disabled" | "default";
  disabled?: boolean;
  [key: string]: any;
}

const Button = ({ children, className, mode = "default", ...rest }: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  if (mode === "disabled") {
    rest.onClick = () => {};
  }

  return (
    <div
      className={`${theme.ui.spacing} ${theme.ui.borders} ${theme.ui.outline}
          whitespace-nowrap font-medium ${
            {
              primary:
                "text-white bg-green-500 border-green-600 active:bg-green-600 cursor-pointer",
              danger:
                "text-white bg-red-500 border-red-600 active:bg-red-600 cursor-pointer",
              disabled: "cursor-default opacity-60 bg-white",
              default:
                "cursor-pointer bg-white active:bg-stone-200 text-stone-700",
            }[mode]
          } ${className}`}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Button;
