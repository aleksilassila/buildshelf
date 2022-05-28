import theme from "../../constants/theme";
import React, { useState } from "react";

interface Props {
  onClick: (any?) => void;
  children?: React.ReactNode;
  className?: string;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  className,
  disabled = false,
  primary = false,
  ...rest
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`${theme.ui.spacing} ${theme.ui.borders} ${theme.ui.outline}
          whitespace-nowrap cursor-pointer font-medium text-stone-700
          active:bg-stone-200 ${
            primary && !disabled
              ? "text-white bg-green-400 border-green-200 active:bg-green-500"
              : "bg-white"
          } ${
        disabled && "cursor-default opacity-70 active:bg-white"
      } ${className}`}
      onBlur={() => setIsFocused(false)}
      onClick={disabled ? () => {} : onClick}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Button;
