import * as React from "react";
import * as classNames from "classnames";

interface GridProps extends React.HTMLProps<{}> {}

export default function Grid({ children, style, className }: GridProps) {
  const cn = ["container"];

  const allClassNames = classNames(className, ...cn);

  return (
    <div className={allClassNames} style={style}>
      {children}
    </div>
  );
}
