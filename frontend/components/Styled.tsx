import React from "react";

const Styled =
  ({ className }) =>
  ({ children }: { children: React.ReactChildren }) =>
    <div className={className}>{children}</div>;

export default Styled;
