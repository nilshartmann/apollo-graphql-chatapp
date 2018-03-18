import * as React from "react";

import * as classNames from "classnames";

import { mapToCssModules } from "./util";

// taken from https://github.com/reactstrap/reactstrap/blob/7c5e690e985e62b8ac65f9de36abe27a351a48ac/src/Col.js

const getSizeClass = (attributeName: string, isXs: boolean, colWidth: string, colSize: string | boolean | number) => {
  if (colSize === true || colSize === "") {
    return isXs ? attributeName : `${attributeName}-${colWidth}`;
  } else if (colSize === "auto") {
    return isXs ? `${attributeName}-auto` : `${attributeName}-${colWidth}-auto`;
  }

  return isXs ? `${attributeName}-${colSize}` : `${attributeName}-${colWidth}-${colSize}`;
};

type Width = number | "auto";

// taken from https://github.com/reactstrap/reactstrap/blob/7c5e690e985e62b8ac65f9de36abe27a351a48ac/src/Col.js
interface ColProps extends React.HTMLProps<{}> {
  align?: "center";
  cssModule?: string;
  tag?: string;

  xs?: Width;
}

function Col(props: ColProps) {
  const { className, cssModule, xs, align, tag: Tag = "div", ...attributes } = props;
  const colClasses: string[] = [];

  if (props.xs) {
    colClasses.push(`col-${props.xs}`);
  }

  if (colClasses.length === 0) {
    colClasses.push("col");
  }

  if (align) {
    colClasses.push(`align-self-${align}`);
  }

  const classes = mapToCssModules(classNames(className, colClasses), cssModule);

  return <Tag {...attributes} className={classes} />;
}
export default Col;
