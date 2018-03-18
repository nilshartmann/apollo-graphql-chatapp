import React from "react";

import classNames from "classnames";

export default function Row({ children, style, align, justify, className }) {
  const cn = ["row"];

  if (align) {
    cn.push(`align-items-${align}`);
  }

  if (justify) {
    cn.push(`justify-content-${justify}`);
  }

  const allClassNames = classNames(className, ...cn);
  return (
    <div className={allClassNames} style={style}>
      {children}
    </div>
  );
}
