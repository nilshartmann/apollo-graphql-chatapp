import * as React from "react";

import * as classNames from "classnames";
interface RowProps extends React.HTMLProps<{}> {
  align?: string;
  justify?: string;
}

export default function Row({ children, style, align, justify, className }: RowProps) {
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
