import React from "react";

const Styled =
  (classes) =>
  ({
    children,
    className,
    ...rest
  }: {
    children: any;
    className?: string;
    rest?: any;
  }) =>
    (
      <div className={classes + " " + className} {...rest}>
        {children}
      </div>
    );

export default Styled;
