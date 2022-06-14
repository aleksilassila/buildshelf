import React from "react";

const Styled =
  (className) =>
  ({
    children,
    className: _className,
    ...rest
  }: {
    children: any;
    className?: string;
    rest?: any;
  }) =>
    (
      <div className={className + " " + _className} {...rest}>
        {children}
      </div>
    );

export default Styled;
