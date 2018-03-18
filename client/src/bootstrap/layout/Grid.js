import React from "react";

import classNames from "classnames";

// interface GridProps extends React.HTMLProps<{}> {}

export default function Grid({ children, style, className }) {
  const cn = ["container"];

  const allClassNames = classNames(className, ...cn);

  return (
    <div className={allClassNames} style={style}>
      {children}
    </div>
  );
}
