import React from "react";

import classNames from "classnames";

import { mapToCssModules } from "./util";

// taken from https://github.com/reactstrap/reactstrap/blob/7c5e690e985e62b8ac65f9de36abe27a351a48ac/src/Col.js

const colWidths = ["xs", "sm", "md", "lg", "xl"];
const defaultProps = {
  tag: "div",
  widths: colWidths
};

const getSizeClass = (attributeName, isXs, colWidth, colSize) => {
  if (colSize === true || colSize === "") {
    return isXs ? attributeName : `${attributeName}-${colWidth}`;
  } else if (colSize === "auto") {
    return isXs ? `${attributeName}-auto` : `${attributeName}-${colWidth}-auto`;
  }

  return isXs ? `${attributeName}-${colSize}` : `${attributeName}-${colWidth}-${colSize}`;
};

// taken from https://github.com/reactstrap/reactstrap/blob/7c5e690e985e62b8ac65f9de36abe27a351a48ac/src/Col.js
const Col = props => {
  const { className, cssModule, widths, align, tag: Tag, ...attributes } = props;
  const colClasses = [];

  widths.forEach((colWidth, i) => {
    let columnProp = props[colWidth];

    if (!i && columnProp === undefined) {
      columnProp = true;
    }

    delete attributes[colWidth];

    if (!columnProp && columnProp !== "") {
      return;
    }

    const isXs = !i;
    let colClass;

    colClass = getSizeClass("col", isXs, colWidth, columnProp);
    colClasses.push(colClass);
  });

  widths.forEach((colWidth, i) => {
    let offsetProps = props[`${colWidth}Offset`];

    if (!i && offsetProps === undefined) {
      offsetProps = true;
    }

    delete attributes[`${colWidth}Offset`];

    if (!offsetProps && offsetProps !== "") {
      return;
    }

    const isXs = !i;
    let offsetClass;

    offsetClass = getSizeClass("offset", isXs, colWidth, offsetProps);
    colClasses.push(offsetClass);
  });

  if (align) {
    colClasses.push(`align-self-${align}`);
  }

  const classes = mapToCssModules(classNames(className, colClasses), cssModule);

  return <Tag {...attributes} className={classes} />;
};
Col.defaultProps = defaultProps;
export default Col;
