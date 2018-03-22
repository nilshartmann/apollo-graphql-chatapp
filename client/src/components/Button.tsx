import * as React from "react";
import * as styles from "./Button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<{}> {}

export default function Button(props: ButtonProps) {
  return <button className={styles.Button} {...props} />;
}
